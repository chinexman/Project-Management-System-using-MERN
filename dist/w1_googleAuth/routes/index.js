"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const authorizeUser_1 = __importDefault(require("../auth/authorizeUser"));
const googleController_1 = require("../controllers/googleController");
require("../auth/googleAuth");
const router = (0, express_1.Router)();
//google
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/redirect", passport_1.default.authenticate("google"), googleController_1.googleCallBackFn);
router.get("/login", googleController_1.login);
router.get("/profile", authorizeUser_1.default, googleController_1.homePage);
router.get("/logout", googleController_1.logout);
exports.default = router;
