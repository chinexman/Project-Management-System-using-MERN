"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
require("../authentication/fbauthentication");
const passport_1 = __importDefault(require("passport"));
router.get("/", function (req, res, next) {
    res.render("homepage.ejs");
});
router.get("/profile", isLoggedIn, function (req, res) {
    res.render("login.ejs", {
        user: req.user, // get the user out of session and pass to template
    });
});
router.get("/error", isLoggedIn, function (req, res) {
    res.render("pages/error.ejs");
});
router.get("/auth/facebook", passport_1.default.authenticate("facebook", {
    scope: ["public_profile", "email"],
}));
router.get("/auth/facebook/callback", passport_1.default.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/error",
}));
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect("/");
}
exports.default = router;
