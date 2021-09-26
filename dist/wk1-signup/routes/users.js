"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../controller/user");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/user", user_1.createUser);
exports.default = router;
