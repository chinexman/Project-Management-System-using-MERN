import { Router, Request, Response, NextFunction } from "express";
import { authorization } from "../authentication/Auth";
import { getTasks, deleteTask } from "../controllers/tasks_controller";

const router = Router();

router.get("/", authorization, getTasks);
router.delete("/:id", authorization, deleteTask);

export default router;
