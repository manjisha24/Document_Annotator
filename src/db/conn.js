const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/AnnotateUser", {

}).then(()=>{
    console.log(`connection successful`);
}).catch((e)=>{
    console.log(`Error connecting Mongodb: ${e.message}`);
})