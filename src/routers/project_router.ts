import {
  createInvite,
  createProject,
  updateProject,
  getAllProject,
} from "../controllers/projectController";
import { Router } from "express";

import { authorization } from "../authentication/Auth";
const router = Router();

router.post("/invite", authorization, createInvite);
router.post("/create", authorization, createProject);
router.put("/updateproject/:projectId", authorization, updateProject);
router.get("/getproject", authorization, getAllProject);

export default router;
