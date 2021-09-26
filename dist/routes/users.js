"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get("/login/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/login/error", (req, res) => {
    res.json({ msg: "Unable to log you in." });
});
router.get("/login/success", (req, res) => {
    res.json({ msg: "You're logged in kayode." });
});
router.get("auth/google/callback", passport_1.default.authenticate("google", {
    failureMessage: "Failed to authenticate you. contact kayode",
    failureRedirect: "/error",
    successRedirect: "/login/success",
}), (req, res) => {
    console.log("User: after passport:", req.user);
    res.json({ msg: "Thank you for loggin in." });
});
exports.default = router;
