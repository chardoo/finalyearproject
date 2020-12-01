const express = require("express");
const router = express.Router();
const passport = require("passport");
const companyModel  =require("../models/company")
claimModel = require("../models/claims")


const authcheck = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/");
  }
};

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/claims");
  }
);

router.get("/logout", authcheck, (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/logouta", authcheck, (req, res) => {
  req.logout();
  res.redirect("/admin");
});


// password change for user
router.post("/update", function(req, res){
const {name, password,email } = req.body
console.log("got here:",req.body)
companyModel.findOneAndUpdate({name},{$set:{password}}, function(err, savedCompany){
  console.log(err,savedCompany)
  console.log(" you've changed your password")
  res.redirect("/claims");
})


})
// admi auth
router.post("/admincheck", function(req, res){
  const {name, password} = req.body
  if(name ==="adminrich" && password ==="appiah1414"){
    res.render("index")
    console.log("admin logged in")
  }
  else{
    res.redirect("/admin")
  }
})



/// add compay to by
router.post("/addcompany", function(req, res){
  const {name, password,email} = req.body
 let newcom = new companyModel(req.body)
 newcom.save(function(error,results){
if(error){console.log("not added")}
else{
  res.redirect("/addform")
  console.log("company addded")}
 })
})


// incomplete details for the add companies 
// let isDetailsComplete = details => {
//   const {
//     name,
//     password,
//     email
//   } = details;
//   if (
//     !name ||
//     !password ||
//     !email 
//   ) {
//     return true;
//   }
//   return false;
// };

// const {name, password,email} = req.body
// if (isDetailsComplete(req.body)) {
//   return res.render("form_component", {
//     incompleteDetails: true,
//     message: "Incomplete details"
//   });
// }

module.exports = router;
