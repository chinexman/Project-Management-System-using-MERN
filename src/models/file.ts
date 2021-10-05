import mongoose from "mongoose";

const fileSystem = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  { timestamps: true }
);

const fileModel = mongoose.model("file", fileSystem);

export default fileModel;
