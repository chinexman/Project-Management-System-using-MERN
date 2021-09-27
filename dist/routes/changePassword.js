"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import app from "../../dist/app"
const password_1 = require("../controller/password");
const auth_1 = require("../utils/auth");
const router = (0, express_1.default)();
router.post("/password/changepassword", auth_1.auth, password_1.changePassword);
router.post("/password/signup", password_1.signup);
router.post("/password/login", password_1.login);
router.post("/password/forgetPassword", password_1.forgetPassword);
router.post("/password/resetPassword/:id/:token", password_1.vetResetPassword);
exports.default = router;
