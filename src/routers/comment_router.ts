import { Router, Request, Response, NextFunction } from "express";
import { authorization } from "../authentication/Auth";
import {

  addComment,
  updateComment,
  deleteComment
} from "../controllers/comment_controller";

const router = Router();

router.post("/comment/:id",authorization, addComment);
router.put("/update/:comment", authorization, updateComment);
router.delete("/:id", authorization, deleteComment);


export default router;
