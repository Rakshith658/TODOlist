require("dotenv").config();
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATA_BASE_URL).then(() => {
      console.log("server connected to database");
    });
  } catch (error) {
    console.log(error.message);
  }
  return;
};

export default connectDB;
