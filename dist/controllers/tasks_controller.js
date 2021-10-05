"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTask = exports.uploadFileCloudinary = exports.createTask = void 0;
const task_1 = __importDefault(require("../models/task"));
const cloudinary_1 = require("../utils/cloudinary");
const file_1 = __importDefault(require("../models/file"));
async function createTask(req, res) {
    const { title, description, status, assignee, comments, dueDate } = req.body;
    const getTask = await task_1.default.findOne({
        title: title,
        description: description,
    });
    if (getTask) {
        return res.status(400).json({
            msg: "Task with the title already exists for that particular user",
        });
    }
    const task = new task_1.default({
        ...req.body,
        owner: req.user._id,
        assignee,
    });
    try {
        await task.save();
        return res
            .status(201)
            .json({ msg: "Task created successfully", Task: task });
    }
    catch (err) {
        res.status(400).send(err);
    }
}
exports.createTask = createTask;
async function uploadFileCloudinary(req, res) {
    const file = req.file;
    if (!req.file) {
        return res.status(400).json({ msg: "no file was uploaded." });
    }
    const response = await (0, cloudinary_1.cloudinaryUpload)(file === null || file === void 0 ? void 0 : file.originalname, file === null || file === void 0 ? void 0 : file.buffer);
    if (!response) {
        return res
            .status(500)
            .json({ msg: "Unable to upload file. please try again." });
    }
    //data to keep
    const file_secure_url = response.secure_url;
    //done with processing.
    const newUpload = new file_1.default({
        name: file === null || file === void 0 ? void 0 : file.originalname,
        url: file_secure_url,
    });
    await newUpload.save();
    res
        .status(200)
        .json({ msg: "file uploaded successfully.", fileUrl: file_secure_url });
}
exports.uploadFileCloudinary = uploadFileCloudinary;
async function updateTask(req, res) {
    const taskId = req.params.task;
    console.log(taskId);
    const { title, description, status, assignee, comments, dueDate } = req.body;
    const getTask = await task_1.default.findOne({
        _id: taskId,
        owner: req.user._id,
    });
    console.log(getTask);
    if (!getTask) {
        return res.status(404).json({
            msg: "Task with the title does not exists for that particular user",
        });
    }
    let updatedTask = await task_1.default.findOneAndUpdate({ owner: req.user._id }, {
        title,
        description,
        status,
        assignee,
        comments,
        dueDate,
    }, { new: true });
    res.status(201).json({
        status: "success",
        data: updatedTask,
    });
}
exports.updateTask = updateTask;
