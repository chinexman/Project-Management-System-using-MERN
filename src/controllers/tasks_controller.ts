import { Request, Response } from "express";
import taskModel from "../models/task";

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
    !taskModel.exists({
      _id: task_id,
    })
  ) {
    return res.status(404).json({
      message: "Task does not exist!",
    });
  }

  if (
    !taskModel.exists({
      _id: task_id,
      admin: user._id,
    })
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
