import express from "express";
import { createTeam } from "../controllers/teams_controller"
import { authorization } from "../authentication/Auth"; 

const router = express.Router()

router.post('/createTeam/:projectId',authorization, createTeam);

export default router;