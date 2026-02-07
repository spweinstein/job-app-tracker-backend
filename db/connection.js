import mongoose from "mongoose";
import chalk from "chalk";
import "dotenv/config";

mongoose.connect(process.env.MONGODB_URI).catch((error) => {
  console.log(chalk.red(`Error: ${error}`));
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log(chalk.red(`MongoDB connection error: ${err}`));
});

export default mongoose.connection;
