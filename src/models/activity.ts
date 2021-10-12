import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const activityModel = mongoose.model("activity", activitySchema);

export default activityModel;
