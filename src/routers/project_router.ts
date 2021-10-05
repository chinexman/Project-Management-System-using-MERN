
import {createInvite,verifyCreateInvite,createProject, updateProject, getAllProject} from '../controllers/projectController'
import { Router } from "express";

import { authorization } from "../authentication/Auth";
const router = Router();

router.post('/invite',authorization, createInvite);
router.post('/project',authorization, createProject)
router.post('/invite/:token',authorization, verifyCreateInvite);
router.post('/updateproject',authorization,updateProject)
router.get('/getproject',authorization, createProject)


export default router;