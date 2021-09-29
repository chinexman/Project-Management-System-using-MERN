import { Router, Request, Response } from "express";
import { createProfile, updateProfile, viewProfile } from "../controllers/profileController";
// import  userAuthorization  from '../Auth/userAuthorization'
import { authorization } from '../../w1-Login/Auth';


const router = Router();

//registration route

router.get('/profile/', authorization, viewProfile);
router.post('/profile', authorization, createProfile)
router.put('/profile/', authorization, updateProfile)




export default router;
