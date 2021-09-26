import { Router } from "express";
import passport from "passport";
import authorizeUser from "../auth/authorizeUser";
import {
  homePage,
  login,
  logout,
  googleCallBackFn,
} from "../controllers/googleController";
import "../auth/googleAuth";

const router = Router();

//google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/redirect",
  passport.authenticate("google"),
  googleCallBackFn
);
router.get("/login", login);
router.get("/profile", authorizeUser, homePage);
router.get("/logout", logout);

export default router;
