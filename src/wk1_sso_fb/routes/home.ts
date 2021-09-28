import express, { Router, Request, Response, NextFunction } from "express";
const router = express.Router();
import passport from "passport";

router.get("/", function (req: Request, res: Response, next: NextFunction) {
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

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
  })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/error",
  })
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

export default router;
