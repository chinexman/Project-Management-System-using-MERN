"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profileController_1 = require("../controllers/profileController");
const userAuthorization_1 = __importDefault(require("../Auth/userAuthorization"));
const router = (0, express_1.Router)();
//registration route
router.post('/profile', userAuthorization_1.default, profileController_1.createProfile);
router.put('/profile/', userAuthorization_1.default, profileController_1.updateProfile);
exports.default = router;
