import mongoose from "mongoose";

const fileSystem = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const fileModel = mongoose.model("file", fileSystem);

export default fileModel;
