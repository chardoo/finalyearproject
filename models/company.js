const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");
const uuidv3 = require("uuid/v3");

const companySchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    minlength: 8,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: v => isEmail(v),
      message: "input should be valid email"
    }
  },
  token: {
    type: String,
    trim: true
  }
});

companySchema.pre("save", async function(next) {
  const company = this;
  try {
    let hashPassword = await bcrypt.hash(company.password, 8);
    let token = await uuidv3(company.email, uuidv3.DNS);

    company.password = hashPassword;
    company.token = token;
  } catch (e) {
    console.log(e);
  }
  next();
});

companySchema.methods.isValidPassword = async function(userPassword) {
  const company = this;
  try {
    const isValid = await bcrypt.compare(userPassword, company.password);
    if (!isValid) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
  }
};

companySchema.methods.generateToken = async function() {
  const company = this;
  try {
    let token = await uuidv3(company.email, uuidv3.DNS);
    company.token = token;
    return company.save().then(savedCompany => savedCompany.token);
  } catch (e) {
    console.log(e);
  }
};

const companyModel = mongoose.model("company", companySchema);
module.exports = companyModel;

// var newone = new companyModel({
//   name : "star assurance",
//   password : "asd123456",
//   email: "star1212@gmail.com"
// })

// newone.save(function(){
//   console.log("one company added to the database")
// })
