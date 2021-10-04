
import {createInvite,createProject} from '../controllers/projectController'
import { Router } from "express";

import { authorization } from "../authentication/Auth";
const router = Router();

router.post('/invite',authorization, createInvite);
router.post('/project',authorization, createProject)
// router.get('/invite/:token',authorization, verifyCreateInvite);


export default router;