import mongoose from "mongoose";
import "dotenv/config";

mongoose.connect(process.env.MONGODB_URI).catch((error) => {
  console.log(`Error: ${error}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

export default mongoose.connection;
