"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
//registration route
router.post('/register', userController_1.registerUser);
router.post("/login", userController_1.loginUser);
router.get("/logout", userController_1.logoutUser);
router.get("/", userController_1.getAllUsers);
exports.default = router;
