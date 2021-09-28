"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../controller/user");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/signup", user_1.createUser);
router.get("/acct-activation/:token", user_1.activateUserAcct);
exports.default = router;
