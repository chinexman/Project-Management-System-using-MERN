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
      require: true,
    },
  },
  { timestamps: true }
);

const taskModel = mongoose.model<Task>("task", taskSchema);

export default taskModel;
