import { Router } from "express";
import {
  addMemberToTeam,
  createTeam,
  updateTeamDetails,
} from "../controllers/teams_controller";
import { authorization } from "../authentication/Auth";

const router = Router();

router.post("/createTeam/:projectId", authorization, createTeam);
router.patch("/updateTeamDetails/:id", authorization, updateTeamDetails);
router.post("/addTeamMembers/:id", authorization, addMemberToTeam);

export default router;
