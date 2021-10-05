import { Router, Request, Response, NextFunction } from "express";
import { authorization } from "../authentication/Auth";
import {
  createTask,
  deleteTask,
  uploadFileCloudinary,
  getTasksByStatus,
  getTasks,
} from "../controllers/tasks_controller";

const router = Router();

router.get("/", authorization, getTasks);
router.delete("/:id", authorization, deleteTask);
router.post("/create", authorization, createTask);
router.post("/upload", authorization, uploadFileCloudinary);
router.get("/getTasks/:status", authorization, getTasksByStatus);

export default router;
