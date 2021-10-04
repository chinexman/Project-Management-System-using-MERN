import { Router, Request, Response, NextFunction } from "express";
import { authorization } from "../authentication/Auth";
const {
  createTask,
  deleteTask,
  getAllTasks,
  uploadFileCloudinary,
} = require("../controllers/tasks_controller");

const router = Router();

router.post("/create", authorization, createTask);
router.delete("/delete/:id", authorization, deleteTask);
router.get("/getTasks", authorization, getAllTasks);
router.post("/upload", authorization, uploadFileCloudinary);

export default router;
