const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.set("returnOriginal", false);

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

module.exports = mongoose.connection;
