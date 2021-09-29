import { Router, Request, Response } from "express";
import { createProfile } from "../controllers/profileController";
import { registerUser, loginUser, getAllUsers, logoutUser } from '../controllers/userController'

const router = Router();

//registration route

router.post('/register', registerUser)

router.post("/login", loginUser)

router.get("/logout", logoutUser)

router.get("/",  getAllUsers)

export default router;
