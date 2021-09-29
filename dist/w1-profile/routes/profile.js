"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profileController_1 = require("../controllers/profileController");
// import  userAuthorization  from '../Auth/userAuthorization'
const Auth_1 = require("../../w1-Login/Auth");
const router = (0, express_1.Router)();
//registration route
router.get('/profile/', Auth_1.authorization, profileController_1.viewProfile);
router.post('/profile', Auth_1.authorization, profileController_1.createProfile);
router.put('/profile/', Auth_1.authorization, profileController_1.updateProfile);
exports.default = router;
