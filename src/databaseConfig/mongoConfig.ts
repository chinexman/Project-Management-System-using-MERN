import mongoose from "mongoose";
mongoose.connect(process.env.MONGODB_URL as string, () => {
  console.log("database is connected.");
});
