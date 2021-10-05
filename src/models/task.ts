import mongoose from "mongoose";

export interface Task {
  title: String;
  description: String;
  status: String;
  owner: String;
  assignee: String;
  fileUploads: [String];
  comments: String;
  dueTime: Date;
}

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Backlog", "todo", "done"],
      required: true,
      default: "Backlog",
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    assignee: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    fileUploads: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "file",
      },
    ],
    comments: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "comment",
      },
    ],
    dueDate: {
      type: mongoose.SchemaTypes.Date,
      required: true,
    },
  },
  { timestamps: true }
);

const taskModel = mongoose.model<Task>("task", taskSchema);

export default taskModel;
