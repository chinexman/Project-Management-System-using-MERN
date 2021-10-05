"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Backlog", "todo", "done"],
        require: true,
        default: "Backlog",
    },
    owner: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "user",
        require: true,
    },
    assignee: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "user",
        require: true,
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
        require: true,
    },
}, { timestamps: true });
const taskModel = mongoose_1.default.model("task", taskSchema);
exports.default = taskModel;
