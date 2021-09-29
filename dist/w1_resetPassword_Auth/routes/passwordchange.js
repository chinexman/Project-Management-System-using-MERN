"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const password_1 = require("../controller/password");
const Auth_1 = require("../../w1-Login/Auth");
const router = (0, express_1.default)();
router.post("/password/changepassword", Auth_1.authorization, password_1.changePassword);
router.post("/password/forgetPassword", password_1.forgetPassword);
router.get("/password/resetPassword/:token", password_1.verifyResetPassword);
router.post("/password/resetPassword/:token", password_1.resetPassword);
exports.default = router;
