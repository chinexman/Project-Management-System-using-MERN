import path from "path";
import { User } from "../models/user";
import Task from "../models/task";
import { cloudinaryUpload } from "../utils/cloudinary";

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
export async function deleteTask(req: userInterface, res: Response) {
  const taskId = await Task.findById({ _id: req.params.id });
  if (!taskId) {
    return res.status(404).send("No task with the id ${taskId} exists");
  }
  try {
    await taskId.remove();
    res.status(200).json({
      msg: "Task with that id deleted from database successfully",
      details: taskId,
    });
  } catch (err) {
    res.status(400).json({ msg: err });
  }
}
export async function getAllTasks(req: userInterface, res: Response) {
  try {
    const getTasks = await Task.find({});
    console.log(getTasks);
    if (getTasks.length < 1) {
      return res.status(404).json({ msg: "No task created yet" });
    }
    res.status(200).json({ msg: getTasks });
  } catch (err) {
    res.status(400).send(err);
  }
}

export async function uploadFileCloudinary(req: Request, res: Response) {
  const file = req.file;
  if (!req.file) {
    return res.status(400).json({
      msg: "no file was uploaded.",
    });
  }

  const response = await cloudinaryUpload(
    file?.originalname as string,
    file?.buffer as Buffer
  );
  if (!response) {
    return res.status(500).json({
      msg: "Unable to upload file. please try again.",
    });
  }

  //data to keep
  const file_secure_url = response.secure_url;

  //done with processing.
  res.json({
    msg: "file uploaded successfully.",
    fileUrl: file_secure_url,
  });
}

//   //define storagefor the images
//   const storage = multer.diskStorage({
//     //destination for files
//     destination: (req: Request, file: any, cb: any) => {
//       cb(null, "../public/files");
//     },
//     //add back the extension that was striped out by multer
//     filename: (req: Request, file: any, cb: any) => {
//       cb(null, Date.now() + file.originalname);
//     },
//   });
//   //upload parameter for multer
//   const upload = multer({
//     storage: storage,
//     limits: {
//       fieldSize: 1024 * 1024 * 3, //3mb
//     },
//   });
// }
