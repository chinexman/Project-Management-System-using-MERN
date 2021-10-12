"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTask = exports.getTasksByStatus = exports.uploadFileCloudinary = exports.createTask = exports.deleteTask = exports.getTasks = exports.addComment = void 0;
const task_1 = __importDefault(require("../models/task"));
const task_2 = __importDefault(require("../models/task"));
const cloudinary_1 = require("../utils/cloudinary");
const file_1 = __importDefault(require("../models/file"));
const joi_1 = __importDefault(require("joi"));
const comments_1 = __importDefault(require("../models/comments"));
async function addComment(req, res) {
    const commentSchemaJoi = joi_1.default.object({
        commenter: joi_1.default.string().required(),
        body: joi_1.default.string().required(),
    });
    const validationResult = commentSchemaJoi.validate(req.body);
    //check for errors
    if (validationResult.error) {
        return res.status(400).json({
            msg: validationResult.error.details[0].message,
        });
    }
    const user = req.user;
    const task = await task_1.default.findById(req.params.id);
    if (!task) {
        return res.status(404).json({
            msg: "You can't add comment to this task. Task does not exist.",
        });
    }
    const newComment = await comments_1.default.create(req.body);
    //add comment to task
    task.comments.push(newComment._id);
    task.save();
    return res.status(200).json({
        msg: "comment added successfully",
        task: task,
    });
}
exports.addComment = addComment;
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
        owner: user._id,
    }))) {
        return res.status(403).json({
            message: "You are not authorized to delete this task.",
        });
    }
    const deletedTask = await task_1.default.findOneAndDelete({
        _id: task_id,
        owner: user._id,
    });
    res.status(200).json({
        message: "Deleted successfully",
        deletedTask,
    });
}
exports.deleteTask = deleteTask;
async function createTask(req, res) {
    const taskSchemaJoi = joi_1.default.object({
        title: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        status: joi_1.default.string(),
        assignee: joi_1.default.string().required(),
        dueDate: joi_1.default.string().required(),
    });
    const validationResult = taskSchemaJoi.validate(req.body);
    //check for errors
    if (validationResult.error) {
        return res.status(400).json({
            msg: validationResult.error.details[0].message,
        });
    }
    const { title, description, status, assignee, dueDate } = req.body;
    const getTask = await task_2.default.findOne({
        title: title,
        description: description,
    });
    if (getTask) {
        return res.status(400).json({
            msg: "Task with the title already exists for that particular user",
        });
    }
    const task = new task_2.default({
        ...req.body,
        owner: req.user._id,
    });
    try {
        await task.save();
        //TODO: Create an activity everytime a task is created or being assigned.
        /**
         * const newActivity =  activityModel.create({
         * msg:`${req.user.fullname assigned ${req.body.assignee.fullname} to perform TASK: ${task.title}`
         * }) created activityfor task function and create activity for comment function
         */
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
    await task.save();
    res.status(200).json({ msg: "file uploaded successfully." });
}
exports.uploadFileCloudinary = uploadFileCloudinary;
async function getTasksByStatus(req, res) {
    //  const taskStatus = await Task.findById({ status: req.params.status });
    try {
        const getTask = await task_2.default.find({ status: req.params.status });
        if (getTask.length < 1) {
            return res.status(404).json({ msg: `${req.params.status} cleared` });
        }
        res.status(200).json({ tasks: getTask });
    }
    catch (err) {
        res.status(400).send(err);
    }
}
exports.getTasksByStatus = getTasksByStatus;
async function updateTask(req, res) {
    const taskId = req.params.task;
    const taskSchemaJoi = joi_1.default.object({
        title: joi_1.default.string(),
        description: joi_1.default.string(),
        status: joi_1.default.string(),
        assignee: joi_1.default.string(),
        createdAt: joi_1.default.string(),
        dueDate: joi_1.default.string(),
    });
    const validationResult = taskSchemaJoi.validate(req.body);
    //check for errors
    if (validationResult.error) {
        return res.status(400).json({
            msg: validationResult.error.details[0].message,
        });
    }
    const { title, description, status, assignee, dueDate, createdAt } = req.body;
    const getTask = await task_2.default.findOne({
        _id: taskId,
        owner: req.user._id,
    });
    if (!getTask) {
        return res.status(404).json({
            msg: "Task with the title does not exists for that particular user",
        });
    }
    let updatedTask = await task_2.default.findOneAndUpdate({ owner: req.user._id }, {
        title: title || getTask.title,
        description: description || getTask.description,
        status: status || getTask.status,
        assignee: assignee || getTask.status,
        dueDate: dueDate ? new Date(dueDate) : getTask.dueDate,
        createdAt: createdAt ? new Date(createdAt) : getTask.createdAt,
    }, { new: true });
    //TODO: only create activity when there is a change in assignee
    if (getTask.assignee.toString() !== assignee) {
        //create activity
    }
    res.status(201).json({
        status: "success",
        data: updatedTask,
    });
}
exports.updateTask = updateTask;
