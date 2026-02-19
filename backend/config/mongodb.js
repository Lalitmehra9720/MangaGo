
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("db connected successfully ");

    //  Print database name
    console.log("Connected Database Name:", mongoose.connection.name);

  } catch (err) {
    console.log("Database Error:", err);
    console.log("problem in connecting database ");
  }
};
