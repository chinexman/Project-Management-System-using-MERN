"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["backlog", "todo", "done"],
        required: true,
        default: "backlog",
    },
    owner: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "user",
        required: true,
    },
    assignee: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "user",
        required: true,
    },
    fileUploads: [
        {
            type: mongoose_1.default.SchemaTypes.ObjectId,
            ref: "file",
        },
    ],
    comments: [
        {
            type: mongoose_1.default.SchemaTypes.ObjectId,
            ref: "comment",
        },
    ],
    dueDate: {
        type: mongoose_1.default.SchemaTypes.Date,
        required: true,
    },
}, { timestamps: true });
const taskModel = mongoose_1.default.model("task", taskSchema);
exports.default = taskModel;
