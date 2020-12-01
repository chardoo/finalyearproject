const express = require("express");
const router = express.Router();
const companyModel = require("../models/company")

const claimModel =  require("../models/claims")


/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

///  all claims been display at asdmin side

// router.get("/claimsmade", function(req, res, next) {
// let allclaims = claimModel.find() 
// console.log(allclaims) 
// });



module.exports = router;
