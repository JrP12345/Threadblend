import mongoose from "mongoose";
const registerSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile:{
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
  });
  
  export const User = mongoose.model("User", registerSchema);
