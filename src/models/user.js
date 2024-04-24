// user.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isEmail } = require("validator");

const documentSchema = new mongoose.Schema({
    title: String,
    content: Buffer
});

const annotationProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    uploadedDocument: String,
    currentSentence: String,
    annotatedDocument: String,
    documentName: String,
    label: String,
    pageUrl: String, // Add pageUrl field to store the URL of the NER or SA page
    currentIndex: Number, // Add currentIndex field to store the current index
    dateModified: {
        type: Date,
        default: Date.now
    }
});

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Please enter Full Name']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please enter email'],
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [6, 'Minimum password length is 6']
    },
    number: {
        type: Number,
        required: [true, 'Please enter Phone no.']
    },
    documents: [documentSchema],
    annotationProgress: [annotationProgressSchema] // Store annotation progress
});

// generating user token
/*
userSchema.methods.generateAuthToken = async function(){
    try {
        const token= jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY );
        this.tokens= this.tokens.concat({token:token})
        console.log(token);
        await this.save();
        return token;
    } catch (error) {
        res.send("the error part"+error);
        console.log("the error part"+error);
    }
}
*/



// password hashing
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        // const passwordHash= await brycpt.hash(password, 10);
        // console.log(`the current password is ${this.password}`);
        this.password=await bcrypt.hash(this.password, 10);
        // console.log(`the current password is ${this.password}`);
    }
    next();
})

// static method to login user
userSchema.statics.login= async function(email, password){
    const user= await this.findOne({ email: email });
    if(user){
        const auth=await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
}


// collection formation
const Signup= new mongoose.model("User", userSchema);

module.exports = Signup;