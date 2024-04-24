const jwt= require("jsonwebtoken");
const Signup = require("../src/models/user");

// token authentication
const requireAuth=(req, res, next)=>{
    const token=req.cookies.jwt;

    // check jwt exists & is verified
    if(token){
        jwt.verify(token, process.env.SECRET_KEY, (error, decodedToken)=>{
            if(error){
                console.log(error.message);
                res.redirect('/');
            }else{
                // console.log(decodedToken);
                next();
            }
        })
    }
    else{
        res.redirect('/');
    }
}

// check current user
const checkUser =(req, res, next)=>{
    const token=req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.SECRET_KEY, async (error, decodedToken)=>{
            if(error){
                console.log(error.message);
                res.locals.user=null;
                next();
            }else{
                // console.log(decodedToken);
                let user = await Signup.findById(decodedToken.id);
                res.locals.user=user;
                next();
            }
        })
    }else{
        res.locals.user=null;
        next();
    }
}

// extract userID
const extractUserId = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (error, decodedToken) => {
        if (error) {
          console.log(error.message);
          next(error); // Pass error to error handler middleware
        } else {
          req.userId = decodedToken.id; // Extract user ID and attach it to the request object
          next(); // Move to the next middleware
        }
      });
    } else {
      next(); // If token doesn't exist, move to the next middleware
    }
  };

module.exports={requireAuth, checkUser, extractUserId};