import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    commenter: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
    },

    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const commentModel = mongoose.model("comment", commentSchema);

export default commentModel;
