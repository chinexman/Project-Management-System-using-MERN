"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const teamModel = new mongoose_1.default.Schema({
    teamName: {
        type: String,
        require: true,
    },
    about: {
        type: String,
        require: true,
    },
    members: [{ type: mongoose_1.default.SchemaTypes.ObjectId }],
    projectId: {
        type: String,
        require: true,
    },
    createdBy: {
        type: String,
        require: true,
    },
}, { timestamps: true });
const Team = mongoose_1.default.model("Team", teamModel);
exports.default = Team;
