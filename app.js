//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

//application
const app = express();

//app parameters set and use and mongoose
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB" , {
useUnifiedTopology: true,
useNewUrlParser: true,
})
//user database schema

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

const secret = process.env.SECRET
userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);

//home page

app.get("/" , function(req, res){
  res.render("home")
})


//login page
app.get("/login" , function(req, res){
  res.render("login", {massage:" "})
});



app.post("/login", function(req, res){
  const userEmail = req.body.username
  const password = req.body.password
User.findOne({email:userEmail}, function(err , founduser){
  if(founduser.email === userEmail){
    if (founduser.password === password) {
      res.render("secrets")
    }else{
      res.render("login", {massage:"Wrong password"})
    }
  }else if (req.body.username){
    res.send("please register your self first")
  }
})

})

//register page

app.get("/register" , function(req, res){
  res.render("register")
});



app.post("/register", function(req,res){
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);

    }else{
      res.render("secrets")
    }
  });

});












app.listen(3000 , function(){
  console.log("server started on port 3000..");
})
