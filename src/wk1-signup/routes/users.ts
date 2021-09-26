import { createUser } from '../controller/user'

import { Router } from "express";
const router = Router();

router.post("/user", createUser);

export default router;
