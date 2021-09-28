// var express = require('express');
import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
const passport = require("passport");
import { authorization } from "./Auth";
import "./passportConfig";

interface customUser {
  fullname?: string;
}
// Welcome Page
router.get("/welcome", authorization, (req, res) => {
  const user = req.user as customUser;
  res.send(`welcome ${user.fullname}`);
});

router.get(
  "/loginfail",
  function (req: Request, res: Response, next: NextFunction) {
    let message = req.flash("error");
    res.send(message[0]);
  }
);
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/user/welcome",
    failureRedirect: "/user/loginfail",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.send("You have been logged out");
});

export default router;
