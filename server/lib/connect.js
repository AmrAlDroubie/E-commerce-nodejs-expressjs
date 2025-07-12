import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected sucessfuly");
  } catch (error) {
    console.log("Error in connecting to database", error);
    process.exit();
  }
};
