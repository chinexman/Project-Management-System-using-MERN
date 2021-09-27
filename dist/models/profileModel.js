"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const profileSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    profileImage: {
        type: String,
    },
    phoneNo: {
        type: Number,
    },
    userId: {
        type: String
    }
}, { timestamps: true });
const Profile = mongoose_1.default.model("Profile", profileSchema);
exports.default = Profile;
