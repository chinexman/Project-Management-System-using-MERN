import express from "express";
import { createTeam , getAllTeamMembers, leaveTeam, addMemberToTeam } from "../controllers/teams_controller"
import { authorization } from "../authentication/Auth"; 

const router = express.Router()

router.post('/createTeam/:projectId',authorization, createTeam);
router.post('/addTeamMembers/:teamId',authorization, addMemberToTeam);
router.get('/getAllTeamMembers/:teamId',authorization, getAllTeamMembers);
router.get('/leaveTeam/:teamId',authorization, leaveTeam);

export default router;