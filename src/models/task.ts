import mongoose from "mongoose";
//const commentSchema  = require('./comment')

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
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      require: true,
    },
    assignee: {
      type: mongoose.SchemaTypes.ObjectId,
      require: true,
      ref: "user",
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

//new Date("5/10/2021").toISOString()

const taskModel = mongoose.model<Task>("task", taskSchema);

export default taskModel;
