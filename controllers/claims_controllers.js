const claimModel = require("../models/claims");

const home = (req, res) => {
  res.render("claim", {
    incompleteDetails: false,
    message: "",
    company: req.user.name,
    companyemail: req.user.email
  });
};

module.exports.index = home;

const checkClaimRender = async (req, res) => {
  const {
    customerCarNo,
    customerStatus,
    thirdPartyCar,
    thirdPartyStatus,
    dateOfAccident,
    placeOfAccident
  } = req.body;

  let isDoubleClaim = false;

  if (isDetailsComplete(req.body)) {
   return res.render("claim", {
      incompleteDetails: true,
      message: "Incomplete details",
      company: req.user.name 
    });
    return true
  }

  try {
    const foundClaim = await claimModel.find({
      $and: [
        {
          "third_party.car_number": customerCarNo
        },
        {
          date_of_accident: dateOfAccident
        }
      ]
    });
    
    foundClaim.forEach(claim => {
      if (claim.customer.car_number === thirdPartyCar) {
        if (claim.customer.status === "yes" && thirdPartyStatus === "yes") {
          isDoubleClaim = true;
        }
      }

      if (
        claim.third_party.every(v => v.status === "yes") &&
        customerStatus === "yes"
      )
        isDoubleClaim = true;
    });

    const duplicateData = await claimModel.find({
      $and: [
        {
          "customer.car_number": customerCarNo
        },
        {
          "customer.status": "yes"
        }
      ]
    });


    if (duplicateData.length > 0) {
      return res.render("claim_check_result", {
        company: req.user.name,
        message: `This same Claim found at ${duplicateData[0].insurance_company_name}`,
        });
    }

    if (!isDoubleClaim) {
      const newClaim = new claimModel({
        insurance_company_name: req.user.name,
        customer: { car_number: customerCarNo, status: customerStatus },
        third_party: { car_number: thirdPartyCar, status: thirdPartyStatus },
        date_of_accident: dateOfAccident,
        place_of_accident: placeOfAccident
      });

      newClaim.save().then(claim => {
        res.render("claim_check_result", {
          company: req.user.name,
          message: "This Claim is valid you can proceed to pay the claimant"
        });
      });
    } else {
      const company_name = foundClaim[0].insurance_company_name;

      res.render("claim_check_result", {
        company: req.user.name,
        message: ` This Claim is found at ${company_name}`
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.checkClaimRender = checkClaimRender;

const isDetailsComplete = details => {
  const {
    customerCarNo,
    customerStatus, 
    thirdPartyCar,
    thirdPartyStatus,
    dateOfAccident,
    placeOfAccident
  } = details;
  if ( 
    !customerCarNo ||
    !customerStatus ||
    !thirdPartyCar ||
    !thirdPartyStatus ||
    !dateOfAccident ||
    !placeOfAccident
  ) {
    return true;
  }
  return false;
};



