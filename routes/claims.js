const express = require("express");
const router = express.Router();
const claimModel = require("../models/claims");
const claimController = require("../controllers/claims_controllers");

const authCheck = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/");
  }
};

// get home page
router.get("/", authCheck, claimController.index);

// making a post request to the database
router.post("/check", authCheck, claimController.checkClaimRender);

module.exports = router;
