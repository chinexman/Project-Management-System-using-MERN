"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const profileSchema = new mongoose_1.default.Schema({
    userId: {
        type: String
    },
    email: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    gender: {
        type: String,
    },
    role: {
        type: String,
    },
    location: {
        type: String,
    },
    about: {
        type: String,
    },
    profileImage: {
        type: String,
    }
}, { timestamps: true });
const Profile = mongoose_1.default.model("Profile", profileSchema);
exports.default = Profile;
