import path from "path";
import { User } from "../models/user";
import Task from "../models/task";
import { cloudinaryUpload } from "../utils/cloudinary";
import fileModel from "../models/file";

import { Request, Response, NextFunction } from "express";
interface userInterface extends Request {
  user: User;
}

export async function createTask(req: userInterface, res: Response) {
  const { title, description, status, assignee, comments, dueDate } = req.body;
  const getTask = await Task.findOne({
    title: title,
    description: description,
  });

  if (getTask) {
    return res.status(400).json({
      msg: "Task with the title already exists for that particular user",
    });
  }
  const task = new Task({
    ...req.body,
    owner: req.user._id,
    assignee,
  });
  try {
    await task.save();
    return res
      .status(201)
      .json({ msg: "Task created successfully", Task: task });
  } catch (err) {
    res.status(400).send(err);
  }
}

export async function uploadFileCloudinary(req: Request, res: Response) {
  const file = req.file;
  if (!req.file) {
    return res.status(400).json({ msg: "no file was uploaded." });
  }
  const response = await cloudinaryUpload(
    file?.originalname as string,
    file?.buffer as Buffer
  );
  if (!response) {
    return res
      .status(500)
      .json({ msg: "Unable to upload file. please try again." });
  }
  //data to keep
  const file_secure_url = response.secure_url;
  //done with processing.
  const newUpload = new fileModel({
    name: [file_secure_url],
  });
  console.log(typeof newUpload);
  await newUpload.save();
  res
    .status(200)
    .json({ msg: "file uploaded successfully.", fileUrl: file_secure_url });
}
