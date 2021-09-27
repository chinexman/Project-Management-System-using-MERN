import { Router, Request, Response } from "express";
import { createProfile ,updateProfile} from "../controllers/profileController";
import  userAuthorization  from '../Auth/userAuthorization'


const router = Router();

//registration route

 router.post('/profile',userAuthorization, createProfile)
router.put('/profile/',userAuthorization, updateProfile)




export default router;
