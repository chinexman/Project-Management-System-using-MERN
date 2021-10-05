import taskModel from "../models/task";
import Task from "../models/task";
import { cloudinaryUpload } from "../utils/cloudinary";
import { Request, Response } from "express";

export async function getTasks(req: Request, res: Response) {
  const user = req.user as typeof req.user & { _id: string };
  const user_tasks = await taskModel.find({ assignee: user._id });
  res.status(200).json({
    tasks: user_tasks,
  });
}

export async function deleteTask(req: Request, res: Response) {
  const user = req.user as typeof req.user & { _id: string };
  const task_id = req.params.id;
  if (
    !(await taskModel.exists({
      _id: task_id,
    }))
  ) {
    return res.status(404).json({
      message: "Task does not exist!",
    });
  }

  if (
    !(await taskModel.exists({
      _id: task_id,
      admin: user._id,
    }))
  ) {
    return res.status(403).json({
      message: "You are not authorized to delete this task.",
    });
  }
  const deletedTask = await taskModel.findOneAndDelete({
    _id: task_id,
    admin: user._id,
  });

  res.status(200).json({
    message: "Deleted successfully",
    deletedTask,
  });
}

export async function createTask(req: Request, res: Response) {
  const { title, description, status, assignee, comments, dueDate } = req.body;
  const user = req.user as typeof req.user & { _id: string };
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
    owner: user._id,
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

export async function getAllTasks(req: Request, res: Response) {
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

export async function getTasksByStatus(req: Request, res: Response) {
  //  const taskStatus = await Task.findById({ status: req.params.status });
  try {
    const getTask = await Task.find({ status: req.params.status });
    console.log(getTask);
    if (getTask.length < 1) {
      return res.status(404).json({ msg: `${req.params.status} cleared` });
    }
    res.status(200).json({ msg: getTask });
  } catch (err) {
    res.status(400).send(err);
  }
}
