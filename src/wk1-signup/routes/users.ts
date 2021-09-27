import { createUser, activateUserAcct } from '../controller/user'

import { Router } from "express";
const router = Router();

router.post("/user", createUser);
router.get("/auth/acctActivation/:token", activateUserAcct);
router.get("/auth", activateUserAcct);

export default router;
