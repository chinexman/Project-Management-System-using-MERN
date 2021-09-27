import express from "express"
// import app from "../../dist/app"
import { changePassword, signup, login, forgetPassword, resetPassword, verifyResetPassword} from "../controller/password"
import { auth } from "../utils/auth"                                    


const router = express()

router.post("/password/changepassword", auth, changePassword)
router.post("/password/signup", signup)
router.post("/password/login", login)
router.post("/password/forgetPassword", forgetPassword)
router.get("/password/resetPassword/:token", verifyResetPassword)
router.post("/password/resetPassword/:token", resetPassword)


export default router;
