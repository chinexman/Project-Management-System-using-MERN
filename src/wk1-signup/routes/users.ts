import { createUser, activateUserAcct } from '../controller/user'

import { Router } from "express";
const router = Router();

router.post("/signup", createUser);
router.get("/acct-activation/:token", activateUserAcct);


export default router;
