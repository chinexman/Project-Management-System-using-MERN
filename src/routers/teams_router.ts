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

router.post("/createTeam/:projectId", authorization, createTeam);
router.put("/updateTeamDetails/:id", authorization, updateTeamDetails);
router.post("/createTeam/:projectId", authorization, createTeam);
router.post("/addTeamMembers/:teamId", authorization, addMemberToTeam);
router.get("/getAllTeamMembers/:teamId", authorization, getAllTeamMembers);
router.get("/leaveTeam/:teamId", authorization, leaveTeam);

export default router;
