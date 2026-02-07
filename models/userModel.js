import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
  },
});

userSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

export default mongoose.model("User", userSchema);
