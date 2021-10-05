import { Router, Request, Response, NextFunction } from "express";
import { authorization } from "../authentication/Auth";
const {
  createTask,
  uploadFileCloudinary,
} = require("../controllers/tasks_controller");

const router = Router();

router.post("/create", authorization, createTask);
router.post("/upload/:taskid", authorization, uploadFileCloudinary);

export default router;
