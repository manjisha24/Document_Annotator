require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser, extractUserId }=require("../middleware/authmiddleware");
const multer=require("multer");
const fs = require('fs');
const mammoth = require('mammoth');

require("./db/conn");
const Signup = require("./models/user");
const { log } = require('console');

// handle errors
const handleErrors=(error)=>{
  console.log(error.message, error.code);
  let errors = {fullname: '', email: '', password:'', number:''};

  // incorrect email
  if(error.message==='Incorrect email'){
    errors.email='Enter registered email id';
  }
  // incorrect password
  if(error.message==='Incorrect password'){
    errors.password='Enter correct password';
  }

  // duplicate error code
  if(error.code===11000){
    // errors.email='User already exists';
    // return errors;
    if (error.keyPattern.hasOwnProperty('email')) {
      errors.email = 'Email already exists';
    }
    if (error.keyPattern.hasOwnProperty('number')) {
      errors.number = 'Phone number already exists';
    }
    return errors;
  }

  // validation errors
  if(error.message.includes('User validation failed')){
    Object.values(error.errors).forEach(({properties})=>{
      // console.log(properties);
      errors[properties.path]=properties.message;
    });
  }
  return errors;
}

// Token creation
const maxAge= 3*24*60*60;
const createToken=(id)=>{
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: maxAge
  });
}

// Multer storage
const storage=multer.diskStorage({
  destination: function(req, file, cb){
    return cb(null, './uploads');
  },
  filename: function(req, file, cb){
    const dateVar = Date.now();
    cb(null, dateVar+'-'+file.originalname);
  },
});
const upload=multer({storage: storage});

const port = process.env.PORT || 5000;

// middlewares
const static_path = path.join(__dirname, "../public");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.use(cookieParser());

// view engine
app.set("view engine", "hbs");

// console.log(process.env.SECRET_KEY);

// ROUTES
app.get('*', checkUser);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/dashboard", extractUserId, async(req, res)=>{
  try {
    // Log that the user is authenticated
    // console.log("User Authenticated");

    const user = await Signup.findById(req.userId);
        const progress = user.annotationProgress;
        
        // Render the dashboard template with progress data
        res.render('dashboard', { progress });

    // res.render('dashboard');
} catch (error) {
    console.error("Dashboard Route Error:", error);
    res.status(500).send("Internal Server Error");
}
})

// Dashboard route to handle opening progress
app.get('/dashboard/open/:progressId', extractUserId, async (req, res) => {
  try {
      // Extract progress ID from URL parameter
      const progressId = req.params.progressId;
      // Retrieve the user from the database
      const user = await Signup.findById(req.userId);
      if (!user) {
        // User not found, send 404 Not Found status
        return res.status(404).send('User not found');
      }
      // Find the progress data by progressId
      const progress = user.annotationProgress.find(progress => progress._id.equals(progressId));    
      if (!progress) {
        // Progress not found, send 404 Not Found status
        return res.status(404).send('Progress not found');
      }
      console.log(progress);

      // Redirect to the pageUrl with progress data
      // Prepend domain and port information to the pageUrl
      const domain = req.protocol + '://' + req.get('host');
      console.log(domain);
      const redirectUrl = `${domain}${progress.pageUrl}&uploadedDocument=${progress.uploadedDocument}&currentSentence=${progress.currentSentence}&annotatedDocument=${progress.annotatedDocument}&currentIndex=${progress.currentIndex}`;
      res.redirect(redirectUrl);
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while opening progress');
  }
});

// Dashboard route to handle deleting progress
app.delete('/dashboard/delete/:progressId', extractUserId, async (req, res) => {
  try {
    const { progressId } = req.params;
    // Retrieve the user from the database
    const user = await Signup.findById(req.userId);
    if (!user) {
      // User not found, send 404 Not Found status
      return res.status(404).send('User not found');
    }
    // Find the index of the progress data by progressId
    const progressIndex = user.annotationProgress.findIndex(progress => progress._id.equals(progressId));
    if (progressIndex === -1) {
      // Progress not found, send 404 Not Found status
      return res.status(404).send('Progress not found');
    }
    // Remove the progress from the user's annotationProgress array
    user.annotationProgress.splice(progressIndex, 1);
    await user.save(); // Save the user to update the changes
    res.sendStatus(200); // Send success response
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Send error response
  }
});


app.get("/home", requireAuth, (req, res)=>{
  res.render("home");
})

app.get("/upload_ner", requireAuth, (req, res)=>{
  res.render("upload_ner");
})

app.get("/upload_sa", requireAuth, (req, res)=>{
  res.render("upload_sa");
})

app.get("/ner-label", requireAuth, (req, res)=>{
  res.render("ner-label");
})

app.get("/sa-label", requireAuth, (req, res)=>{
  res.render("sa-label");
})

app.get("/ner", extractUserId, async (req, res)=>{
  try {
    const userId = req.userId; // Extracting user ID from authenticated request

    // Retrieve the last uploaded document content for the user
    const user = await Signup.findById(userId);
    if (!user || !user.documents || user.documents.length === 0) {
      // Handle case where user or documents are not found
      if(!user)res.status(404).send("No user")
      else
      res.status(404).send("No documents found");
      return;
    }
    const lastDocument = user.documents[user.documents.length - 1];
    const documentContent = lastDocument ? lastDocument.content : '';

    // Render sa.hbs template with document content
    res.render("ner", { documentContent });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }

})

app.get("/sa", extractUserId, async (req, res)=>{
  try {
    const userId = req.userId; // Extracting user ID from authenticated request

    // Retrieve the last uploaded document content for the user
    const user = await Signup.findById(userId);
    if (!user || !user.documents || user.documents.length === 0) {
      // Handle case where user or documents are not found
      if(!user)res.status(404).send("No user")
      else
      res.status(404).send("No documents found");
      return;
    }
    const lastDocument = user.documents[user.documents.length - 1];
    const documentContent = lastDocument ? lastDocument.content : '';

    // Render sa.hbs template with document content
    res.render("sa", { documentContent });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

// create user in our database
app.post("/signup", async (req, res) => {
  const { fullname, email, password, number } = req.body;
  try {
    // middleware
    // generating token
    /*
    console.log("the success part"+ registeruser);

    const token= await registeruser.generateAuthToken();
    console.log("the token part"+ token);

    res.cookie("jwt", token);
    console.log(cookie);
    */
    const registeruser= await Signup.create({fullname, email, password, number});
    const token = createToken(registeruser._id);
    res.cookie('jwt', token, {httpOnly:true, maxAge: maxAge*1000});
    res.status(201).json(registeruser._id);

  } catch (error) {
    const errors= handleErrors(error);
    res.status(400).json({ errors });
  }
});

// login auth
app.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user= await Signup.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, {httpOnly:true, maxAge: maxAge*1000});
    res.status(201).json(user._id);
  } catch (error) {
    const errors= handleErrors(error);
    res.status(400).json({ errors });
  }
});

// Function to extract text content from .docx and .doc files
async function extractTextFromDocx(fileContent) {
  return new Promise((resolve, reject) => {
    mammoth.extractRawText({ buffer: fileContent })
      .then((result) => {
        resolve(result.value);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// sa-upload
// app.post("/upload_sa",extractUserId, upload.single('file'), async (req, res)=>{
//   try {
//     const userId = req.userId; // Extracting user ID from authenticated request
    
//     // Read the content of the uploaded file
//     const fileContent = fs.readFileSync(req.file.path);
//     const fileContentString = fileContent.toString('utf-8');
//     console.log(fileContentString);
//     // Update user's schema to include the uploaded document content
//     const updatedUser = await Signup.findByIdAndUpdate(userId, {
//       $push: {
//         documents: {
//           title: req.body.title, // Assuming title is sent in the request body
//           content: fileContentString // Storing file content
//         }
//       }
//     }, { new: true }); // Ensure to get the updated document

//     if (!updatedUser) {
//       throw new Error('User not found');
//     }

//     // Redirect to sa.hbs
//     res.redirect("/sa");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });
app.post("/upload_sa", extractUserId, upload.single("file"), async (req, res) => {
  try {
    const userId = req.userId; // Extracting user ID from authenticated request

    // Read the content of the uploaded file
    const fileContent = fs.readFileSync(req.file.path);

    let textContent;

    // Handle different file types
    switch (req.file.mimetype) {
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": // .docx
        textContent = await extractTextFromDocx(fileContent);
        break;
      case "application/msword": // .doc
        textContent = await extractTextFromDoc(fileContent);
        break;
      case "text/plain": // .txt
        textContent = fileContent.toString("utf-8");
        break;
      default:
        throw new Error("Unsupported file format");
    }

    // Update user's schema to include the uploaded document content
    const updatedUser = await Signup.findByIdAndUpdate(
      userId,
      {
        $push: {
          documents: {
            title: req.body.title, // Assuming title is sent in the request body
            content: textContent, // Storing extracted text content
          },
        },
      },
      { new: true }
    ); // Ensure to get the updated document

    if (!updatedUser) {
      throw new Error("User not found");
    }

    // Redirect to sa.hbs
    res.redirect("/sa-label");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ner-upload
app.post("/upload_ner",extractUserId, upload.single('file'), async (req, res)=>{
  // console.log(req.body);
  // console.log(req.file);
  // // res.send("Hi");
  // return res.redirect("/ner-label");
  // 
  // try {
  //   const userId = req.userId; // Extracting user ID from authenticated request

  //   // Update user's schema to include the uploaded document
  //   const updatedUser = await Signup.findByIdAndUpdate(userId, {
  //     $push: {
  //       documents: {
  //         title: req.body.title, // Assuming title is sent in the request body
  //         content: req.file.filename // Storing filename as content, you can modify this as needed
  //       }
  //     }
  //   }, { new: true }); // Ensure to get the updated document

  //   if (!updatedUser) {
  //     throw new Error('User not found');
  //   }

  //   // Redirect to ner-label.hbs with document content
  //   res.redirect(`/ner-label?documentContent=${req.file.filename}`); // Passing document content as query parameter
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).send("Internal Server Error");
  // }
  try {
    const userId = req.userId; // Extracting user ID from authenticated request

    // Read the content of the uploaded file
    const fileContent = fs.readFileSync(req.file.path);

    let textContent;

    // Handle different file types
    switch (req.file.mimetype) {
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": // .docx
        textContent = await extractTextFromDocx(fileContent);
        break;
      case "application/msword": // .doc
        textContent = await extractTextFromDoc(fileContent);
        break;
      case "text/plain": // .txt
        textContent = fileContent.toString("utf-8");
        break;
      default:
        throw new Error("Unsupported file format");
    }

    // Update user's schema to include the uploaded document content
    const updatedUser = await Signup.findByIdAndUpdate(
      userId,
      {
        $push: {
          documents: {
            title: req.body.title, // Assuming title is sent in the request body
            content: textContent, // Storing extracted text content
          },
        },
      },
      { new: true }
    ); // Ensure to get the updated document

    if (!updatedUser) {
      throw new Error("User not found");
    }

    // Redirect to sa.hbs
    res.redirect("/ner-label");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to handle saving progress
app.post('/save-progress',extractUserId, async (req, res) => {
  try {
      const { uploadedDocument, currentSentence, annotatedDocument, documentName, label, route, currentIndex } = req.body;

      // Save progress to MongoDB
      // Assuming you have a User model and you're saving progress to the annotationProgress field
      const user = await Signup.findById(req.userId);
      // const userId = req.userId; // Extracting user ID from authenticated request

      user.annotationProgress.push({
          uploadedDocument,
          currentSentence,
          annotatedDocument,
          documentName,
          label,
          pageUrl: route, // Save URL of the current page
          currentIndex
      });
      await user.save();

      res.status(200).send('Progress saved successfully');
  } catch (error) {
      console.error(error);
      res.status(500).send('Failed to save progress');
  }
});



// Logout route
app.get("/logout", (req, res) => {
  res.cookie('jwt', '', {maxAge: 1});
  res.redirect('/')
});


// cookies
/*
app.get('/set-cookies', (req, res)=>{
  // res.setHeader('Set-Cookie', 'newUser=true');

  res.cookie('newUser', false);
  res.cookie('isEmployeee', false, {httpOnly: true })
  res.send('You got the cookies');
})
app.get('/read-cookies', (req, res)=>{
  const cookies=req.cookies;
  console.log(cookies);

  res.json(cookies);
})*/

app.listen(port, () => {
  console.log(`server is running at port no ${port}`);
});
