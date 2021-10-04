import {
  createUser,
  activateUserAcct,
  logout,
  loginPage,
  googleSuccessCallBackFn,
  changePassword,
  resetPassword,
  verifyResetPassword,
  forgetPassword,
  viewProfile,
  updateProfile,
} from "../controllers/users_controller";
import {
  createInvite,
  verifyCreateInvite,
  createProject,
} from "../controllers/projectController";
import passport from "passport";
import { Router, Request, Response, NextFunction } from "express";
import { authorization } from "../authentication/Auth";
import "../authentication/passportStrategies";

const router = Router();

interface customUser {
  fullname?: string;
}

// Welcome Page
router.get("/welcome", authorization, (req, res) => {
  const user = req.user as customUser;
  res.json({ msg: `welcome ${user.fullname}` });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/users/welcome",
    failureRedirect: "/users/loginfail",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", authorization, logout);

router.get(
  "/loginfail",
  function (req: Request, res: Response, next: NextFunction) {
    let msg = req.flash("error")[0];
    res.json({
      msg,
    });
  }
);

//google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/redirect",
  passport.authenticate("google"),
  googleSuccessCallBackFn
);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
  })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/users/welcome",
    failureRedirect: "/users/loginfail",
    failureFlash: true,
  })
);
router.get("/loginPage", loginPage);
router.post("/signup", createUser);
router.get("/profile", authorization, viewProfile);
router.put("/profile", authorization, updateProfile);
router.get("/acct-activation/:token", activateUserAcct);
router.post("/password/changepassword", authorization, changePassword);
router.post("/password/forgetPassword", forgetPassword);
router.get("/password/resetPassword/:token", verifyResetPassword);
router.post("/password/resetPassword/:token", resetPassword);
//googlesso, fbsso, profile, changepassword,
export default router;
