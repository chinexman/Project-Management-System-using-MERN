import { Router, Request, Response } from "express";
import { createProfile ,updateProfile,viewProfile} from "../controllers/profileController";
import  userAuthorization  from '../Auth/userAuthorization'


const router = Router();

//registration route

router.get('/profile/',userAuthorization, viewProfile);
 router.post('/profile',userAuthorization, createProfile)
router.put('/profile/',userAuthorization, updateProfile)




export default router;
