"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_controller_1 = require("../controllers/users_controller");
const passport_1 = __importDefault(require("passport"));
const express_1 = require("express");
const Auth_1 = require("../authentication/Auth");
require("../authentication/passportStrategies");
const router = (0, express_1.Router)();
// Welcome Page
router.get("/welcome", Auth_1.authorization, (req, res) => {
    const user = req.user;
    res.json({ msg: `welcome ${user.fullname}` });
});
router.post("/login", (req, res, next) => {
    passport_1.default.authenticate("local", {
        successRedirect: "/users/welcome",
        failureRedirect: "/users/loginfail",
        failureFlash: true,
    })(req, res, next);
});
router.get("/logout", Auth_1.authorization, users_controller_1.logout);
router.get("/loginfail", function (req, res, next) {
    let msg = req.flash("error")[0];
    res.json({
        msg,
    });
});
//google
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/redirect", passport_1.default.authenticate("google"), users_controller_1.googleSuccessCallBackFn);
router.get("/auth/facebook", passport_1.default.authenticate("facebook", {
    scope: ["public_profile", "email"],
}));
router.get("/auth/facebook/callback", passport_1.default.authenticate("facebook", {
    successRedirect: "/users/welcome",
    failureRedirect: "/users/loginfail",
    failureFlash: true,
}));
router.get("/loginPage", users_controller_1.loginPage);
router.post("/signup", users_controller_1.createUser);
router.get("/profile", Auth_1.authorization, users_controller_1.viewProfile);
router.put("/profile", Auth_1.authorization, users_controller_1.updateProfile);
router.get("/acct-activation/:token", users_controller_1.activateUserAcct);
router.post("/password/changepassword", Auth_1.authorization, users_controller_1.changePassword);
router.post("/password/forgetPassword", users_controller_1.forgetPassword);
router.get("/password/resetPassword/:token", users_controller_1.verifyResetPassword);
router.post("/password/resetPassword/:token", users_controller_1.resetPassword);
//googlesso, fbsso, profile, changepassword,
exports.default = router;
