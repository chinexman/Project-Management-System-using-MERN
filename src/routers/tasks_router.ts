import { Router, Request, Response, NextFunction } from "express";
import { authorization } from "../authentication/Auth";
import {
  createTask,
  deleteTask,
  uploadFileCloudinary,
  getTasksByStatus,
  getTasks,
  updateTask,
  addComment,
  getActivity,
  getYesterdayActivity,
} from "../controllers/tasks_controller";

const router = Router();

router.get("/", authorization, getTasks);
router.delete("/:id", authorization, deleteTask);
router.post("/:id/comment", addComment);
router.post("/create", authorization, createTask);
router.get("/getTasks/:status", authorization, getTasksByStatus);
router.post("/upload/:taskid", authorization, uploadFileCloudinary);
router.put("/update/:task", authorization, updateTask);
//router.get("/activity/:timeline", authorization, getActivity);
router.get("/activity", authorization, getActivity);
router.get("/yesterActivities", authorization, getYesterdayActivity);

export default router;
