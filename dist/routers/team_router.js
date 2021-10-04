"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teams_controller_1 = require("../controllers/teams_controller");
const Auth_1 = require("../authentication/Auth");
const router = express_1.default.Router();
router.post('/createTeam/:projectId', Auth_1.authorization, teams_controller_1.createTeam);
exports.default = router;
