
import {createInvite,verifyCreateInvite,createProject} from '../controllers/projectController'
import { createTeam } from "../controllers/teams_controller"
import { Router } from "express";

import { authorization } from "../authentication/Auth";
const router = Router();

router.post('/invite',authorization, createInvite);
router.post('/project',authorization, createProject)
router.post('/invite/:token',authorization, verifyCreateInvite);





export default router;