import activityModel from "../models/activity";
import taskModel from "../models/task";
import Task from "../models/task";
import { cloudinaryUpload } from "../utils/cloudinary";
import fileModel from "../models/file";
import express, { Request, Response } from "express";
import Joi from "joi";
import commentModel from "../models/comments";
import UserModel from "../models/user";

interface userInterface extends Request {
  // user: User;
  user?: { _id?: string; email?: string; fullname?: string };
}
export async function addComment(req: Request, res: Response) {
  const commentSchemaJoi = Joi.object({
    commenter: Joi.string().required(),
    body: Joi.string().required(),
  });

  const validationResult = commentSchemaJoi.validate(req.body);
  //check for errors
  if (validationResult.error) {
    return res.status(400).json({
      msg: validationResult.error.details[0].message,
    });
  }
  const user = req.user;
  const task = await taskModel.findById(req.params.id);
  if (!task) {
    return res.status(404).json({
      msg: "You can't add comment to this task. Task does not exist.",
    });
  }
  const newComment = await commentModel.create(req.body);
  //add comment to task
  task.comments.push(newComment._id);
  task.save();
  return res.status(200).json({
    msg: "comment added successfully",
    task: task,
  });
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
      owner: user._id,
    }))
  ) {
    return res.status(403).json({
      message: "You are not authorized to delete this task.",
    });
  }
  const deletedTask = await taskModel.findOneAndDelete({
    _id: task_id,
    owner: user._id,
  });

  res.status(200).json({
    message: "Deleted successfully",
    deletedTask,
  });
}

export async function createTask(req: userInterface, res: Response) {
  const taskSchemaJoi = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string(),
    assignee: Joi.string().required(),
    dueDate: Joi.string().required(),
  });

  const validationResult = taskSchemaJoi.validate(req.body);
  //check for errors
  if (validationResult.error) {
    return res.status(400).json({
      msg: validationResult.error.details[0].message,
    });
  }

  const { title, description, status, assignee, dueDate } = req.body;
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
  });
  try {
    await task.save();

    //TODO: Create an activity everytime a task is created or being assigned.
    const assigner = req.user?.fullname;
    const assigneeUser = await UserModel.findById(assignee);

    await activityModel.create({
      message: `${assigner} assigned ${
        assigneeUser!.fullname
      } to perform Task: ${task.title}`,
    });

    /**
     * const newActivity =  activityModel.create({
     * msg:`${req.user.fullname assigned ${req.body.assignee.fullname} to perform TASK: ${task.title}`
     * }) created activityfor task function and create activity for comment function
     */
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
  const taskSchemaJoi = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    status: Joi.string(),
    assignee: Joi.string(),
    createdAt: Joi.string(),
    dueDate: Joi.string(),
  });

  const validationResult = taskSchemaJoi.validate(req.body);
  //check for errors
  if (validationResult.error) {
    return res.status(400).json({
      msg: validationResult.error.details[0].message,
    });
  }
  const { title, description, status, assignee, dueDate, createdAt } = req.body;
  const getTask = await Task.findOne({
    _id: taskId,
    owner: req.user!._id,
  });

  if (!getTask) {
    return res.status(404).json({
      msg: "Task with the title does not exists for that particular user",
    });
  }

  let updatedTask = await Task.findOneAndUpdate(
    { owner: req.user!._id },
    {
      title: title || getTask.title,
      description: description || getTask.description,
      status: status || getTask.status,
      assignee: assignee || getTask.status,
      dueDate: dueDate ? new Date(dueDate) : getTask.dueDate,
      createdAt: createdAt ? new Date(createdAt) : getTask.createdAt,
    },
    { new: true }
  );

  //TODO: only create activity when there is a change in assignee

  if (getTask.assignee.toString() !== assignee) {
    await activityModel.create({
      message: `${req.user?.fullname} assigned ${req.body.assignee.fullname} to perform 
      Task: ${getTask.title}`,
    });

    //create activity
  }

  res.status(201).json({
    status: "success",
    data: updatedTask,
  });
}

export async function getActivity(req: express.Request, res: express.Response) {
  const todayDate = new Date();

  const activities = await activityModel.find({});
  const today = activities.filter((activity) => {
    const checkStr =
      activity.createdAt.toString().split(" ")[1] +
      activity.createdAt.toString().split(" ")[2];
    const checkToday =
      todayDate.toString().split(" ")[1] + todayDate.toString().split(" ")[2];
    if (checkStr === checkToday) {
      return true;
    }
  });

  res.json({
    todaysActivities: today,
  });
}
export async function getYesterdayActivity(
  req: express.Request,
  res: express.Response
) {
  const currentDate = new Date();
  try {
    const getAllActivity = await activityModel.find({});
    console.log(getAllActivity);
    if (getAllActivity.length === 0) return res.send("No activity created");

    const getActivity = getAllActivity.filter((activity) => {
      const currentActMon = activity.createdAt.toString().split(" ")[1];
      const currActDate = parseInt(activity.createdAt.toString().split(" ")[2]);
      const getDate = currentActMon + " " + currActDate;

      const getCurrMonth = currentDate.toString().split(" ")[1];
      const getCurrDate = parseInt(currentDate.toString().split(" ")[2]) - 1;
      const yesterdayDate = getCurrMonth + " " + getCurrDate;

      if (getDate === yesterdayDate) {
        return true;
      }
    });
    res.send(getActivity);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
}
