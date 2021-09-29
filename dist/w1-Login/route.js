"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// var express = require('express');
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport = require("passport");
const Auth_1 = require("./Auth");
require("./passportConfig");
// Welcome Page
router.get("/welcome", Auth_1.authorization, (req, res) => {
    const user = req.user;
    res.send(`welcome ${user.fullname}`);
});
router.get("/loginfail", function (req, res, next) {
    let message = req.flash("error");
    res.send(message[0]);
});
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
exports.default = router;
