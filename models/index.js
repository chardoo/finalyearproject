const mongoose = require("mongoose");
const { DB_HOST } = require("../config");
// Connection URL
const url = DB_HOST;

const connectToDatabase = () => {
  mongoose.connect(url, { useNewUrlParser: true });
  const db = mongoose.connection;
  db.once("open", () => {
    console.log("connected to  to the database");
  });
  db.on("error", () => {
    console.log("Error connecting to my database");
  });
};

module.exports = connectToDatabase;
