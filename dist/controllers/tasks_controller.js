"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasksByStatus = exports.uploadFileCloudinary = exports.createTask = exports.deleteTask = exports.getTasks = void 0;
const task_1 = __importDefault(require("../models/task"));
const task_2 = __importDefault(require("../models/task"));
const cloudinary_1 = require("../utils/cloudinary");
const file_1 = __importDefault(require("../models/file"));
async function getTasks(req, res) {
    const user = req.user;
    const user_tasks = await task_1.default.find({ assignee: user._id });
    res.status(200).json({
        tasks: user_tasks,
    });
}
exports.getTasks = getTasks;
async function deleteTask(req, res) {
    const user = req.user;
    const task_id = req.params.id;
    if (!(await task_1.default.exists({
        _id: task_id,
    }))) {
        return res.status(404).json({
            message: "Task does not exist!",
        });
    }
    if (!(await task_1.default.exists({
        _id: task_id,
        admin: user._id,
    }))) {
        return res.status(403).json({
            message: "You are not authorized to delete this task.",
        });
    }
    const deletedTask = await task_1.default.findOneAndDelete({
        _id: task_id,
        admin: user._id,
    });
    res.status(200).json({
        message: "Deleted successfully",
        deletedTask,
    });
}
exports.deleteTask = deleteTask;
async function createTask(req, res) {
    const { title, description, status, assignee, comments, dueDate } = req.body;
    const user = req.user;
    const getTask = await task_2.default.findOne({
        title: title,
        description: description,
    });
    if (getTask) {
        return res.status(409).json({
            msg: "Task with the title already exists for that particular user",
        });
    }
    const task = new task_2.default({
        ...req.body,
        owner: user._id,
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
    const task = await task_2.default.findById({ _id: req.params.taskid });
    if (!task) {
        return res.status(404).json({ msg: "No task id found" });
    }
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
    const newUpload = await file_1.default.create({
        name: file === null || file === void 0 ? void 0 : file.originalname,
        url: file_secure_url,
    });
    task.fileUploads.push(newUpload._id);
    task.save();
    res.status(200).json({ msg: "file uploaded successfully." });
}
exports.uploadFileCloudinary = uploadFileCloudinary;
async function getTasksByStatus(req, res) {
    //  const taskStatus = await Task.findById({ status: req.params.status });
    try {
        const getTask = await task_2.default.find({ status: req.params.status });
        console.log(getTask);
        if (getTask.length < 1) {
            return res.status(404).json({ msg: `${req.params.status} cleared` });
        }
        res.status(200).json({ msg: getTask });
    }
    catch (err) {
        res.status(400).send(err);
    }
}
exports.getTasksByStatus = getTasksByStatus;
