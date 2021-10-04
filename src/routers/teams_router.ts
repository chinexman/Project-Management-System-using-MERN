import express from "express";
import { addMembersToTeam, createTeam, updateTeamDetails } from "../controllers/teams_controller";
import { authorization } from "../authentication/Auth";

const router = express.Router();

router.post("/createTeam/:projectId", authorization, createTeam);
router.patch("/updateTeamDetails/:projectId", authorization, updateTeamDetails )
router.post("/addTeamMembers/:id", authorization, addMembersToTeam);

export default router;
