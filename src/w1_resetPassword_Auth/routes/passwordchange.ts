import express from "express"
import { changePassword,  forgetPassword, resetPassword, verifyResetPassword} from "../controller/password"
import { authorization as auth } from "../../w1-Login/Auth"                                    


const router = express()

router.post("/password/changepassword", auth, changePassword)
router.post("/password/forgetPassword", forgetPassword)
router.get("/password/resetPassword/:token", verifyResetPassword)
router.post("/password/resetPassword/:token", resetPassword)


export default router;
