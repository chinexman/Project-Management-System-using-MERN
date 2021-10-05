import taskModel from "../models/task";
import Task from "../models/task";
import { cloudinaryUpload } from "../utils/cloudinary";
import fileModel from "../models/file";
import { Request, Response } from "express";

interface userInterface extends Request {
  // user: User;
  user?: { _id?: string; email?: string; fullname?: string };
}

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
    owner: req.user!._id,
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
  const task = await Task.findById({ _id: req.params.taskid });
  if (!task) {
    return res.status(404).json({ msg: "No task id found" });
  }
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
  const newUpload = await fileModel.create({
    name: file?.originalname,
    url: file_secure_url,
  });
  task.fileUploads.push(newUpload._id);
  await task.save();
  res.status(200).json({ msg: "file uploaded successfully." });
}

export async function getTasksByStatus(req: Request, res: Response) {
  //  const taskStatus = await Task.findById({ status: req.params.status });
  try {
    const getTask = await Task.find({ status: req.params.status });
    console.log(getTask);
    if (getTask.length < 1) {
      return res.status(404).json({ msg: `${req.params.status} cleared` });
    }
    res.status(200).json({ tasks: getTask });
  } catch (err) {
    res.status(400).send(err);
  }
}

export async function updateTask(req: userInterface, res: Response) {
  const taskId = req.params.task;
  console.log(taskId);
  const { title, description, status, assignee, comments, dueDate } = req.body;
  const getTask = await Task.findOne({
    _id: taskId,
    owner: req.user!._id,
  });
  console.log(getTask);
  if (!getTask) {
    return res.status(404).json({
      msg: "Task with the title does not exists for that particular user",
    });
  }

  let updatedTask = await Task.findOneAndUpdate(
    { owner: req.user!._id },
    {
      title,
      description,
      status,
      assignee,
      comments,
      dueDate,
    },
    { new: true }
  );
  res.status(201).json({
    status: "success",
    data: updatedTask,
  });
}
