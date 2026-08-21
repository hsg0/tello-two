import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  if (!mongoURI) {
    throw new Error("MONGO_URI is not set");
  }

  await mongoose.connect(mongoURI);
  console.log("Connected to MongoDB");
};

export default connectDB;
