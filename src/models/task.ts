import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Backlog", "todo", "done"],
      require: true,
      default: "Backlog",
    },
    admin: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      require: true,
    },
    assignee: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      require: true,
    },
    fileUpload: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "file",
      require: true,
    },
    comments: [{ type: mongoose.SchemaTypes.ObjectId, ref: "comment" }],
    dueDate: {
      type: mongoose.SchemaTypes.Date,
      require: true,
    },
  },
  { timestamps: true }
);

const taskModel = mongoose.model("task", taskSchema);

export default taskModel;
