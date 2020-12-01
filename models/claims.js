const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let car_details = new Schema({
  status: {
    type: String,
    trim: true,
    default: "no"
  },
  car_number: {
    type: String,
    trim: true,
    required: true
  }
});

let claimSchema = mongoose.Schema({
  insurance_company_name: {
    type: String,
    required: true,
    trim: true
  },
  customer: car_details,
  third_party: [car_details],
  date_of_accident: {
    type: Date,
    trim: true,
    required: true
  },
  place_of_accident: {
    type: String,
    trim: true,
    required: true
  }
});

module.exports = mongoose.model("claim", claimSchema);
