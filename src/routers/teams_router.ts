import { Router } from "express";
import {
  createTeam,
  getAllTeamMembers,
  leaveTeam,
  addMemberToTeam,
  updateTeamDetails,
} from "../controllers/teams_controller";
import { authorization } from "../authentication/Auth";

const router = Router();

router.post("/create/:projectId", authorization, createTeam);
router.put("/updateTeamDetails/:id", authorization, updateTeamDetails);
router.post("/addmember/:teamId", authorization, addMemberToTeam);
router.get("/getAllTeamMembers/:teamId", authorization, getAllTeamMembers);
router.get("/leave/:teamId", authorization, leaveTeam);

export default router;
