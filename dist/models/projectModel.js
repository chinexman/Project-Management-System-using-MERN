"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const projectsSchema = new mongoose_1.default.Schema({
    owner: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    collaborators: [{ email: String, isVerified: Boolean }]
}, {
    timestamps: true
});
const Project = mongoose_1.default.model('projects', projectsSchema);
exports.default = Project;
