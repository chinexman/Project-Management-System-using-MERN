"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYesterdayActivity = exports.getActivity = exports.getAllFilesByTask = exports.updateTask = exports.getTasksByStatus = exports.uploadFileCloudinary = exports.createTask = exports.deleteTask = exports.getTasks = exports.addComment = void 0;
const activity_1 = __importDefault(require("../models/activity"));
const task_1 = __importDefault(require("../models/task"));
const task_2 = __importDefault(require("../models/task"));
const cloudinary_1 = require("../utils/cloudinary");
const file_1 = __importDefault(require("../models/file"));
const joi_1 = __importDefault(require("joi"));
const comments_1 = __importDefault(require("../models/comments"));
const user_1 = __importDefault(require("../models/user"));
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
    var _a;
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
        const assigner = (_a = req.user) === null || _a === void 0 ? void 0 : _a.fullname;
        const assigneeUser = await user_1.default.findById(assignee);
        await activity_1.default.create({
            message: `${assigner} assigned ${assigneeUser.fullname} to perform Task: ${task.title} task`,
        });
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
    const file = req.file; //
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
    var _a;
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
        await activity_1.default.create({
            message: `${(_a = req.user) === null || _a === void 0 ? void 0 : _a.fullname} assigned ${req.body.assignee.fullname} to perform 
      Task: ${getTask.title}`,
        });
        //create activity
    }
    res.status(201).json({
        status: "success",
        data: updatedTask,
    });
}
exports.updateTask = updateTask;
async function getAllFilesByTask(req, res) {
    const { taskId } = req.params;
    const taskExist = await task_1.default.exists({ _id: taskId });
    try {
        if (!taskExist) {
            return res.status(404).json({
                msg: "Task with the title does not exists for that particular user",
            });
        }
        const requestedTask = await task_1.default.findOne({ _id: taskId });
        const fileUploads = requestedTask === null || requestedTask === void 0 ? void 0 : requestedTask.fileUploads;
        console.log(fileUploads);
        const filesUrl = fileUploads === null || fileUploads === void 0 ? void 0 : fileUploads.map(async (file) => {
            console.log(file, "fileId");
            const fileObj = await file_1.default.findById(file);
            console.log(fileObj, "file");
            return fileObj.url;
        });
        console.log(filesUrl, "file check");
        const arrrayOfUrls = await Promise.all(filesUrl); ///awaited the array of promises to get  the URL's
        return res.status(201).json({
            status: "success",
            data: arrrayOfUrls,
        });
    }
    catch (err) {
        res.status(400).send(err);
    }
}
exports.getAllFilesByTask = getAllFilesByTask;
async function getActivity(req, res) {
    const todayDate = new Date();
    const allActivities = await activity_1.default.find({});
    const activities = allActivities.filter((activity) => {
        const checkStr = activity.createdAt.toString().split(" ")[1] +
            activity.createdAt.toString().split(" ")[2];
        const checkToday = todayDate.toString().split(" ")[1] + todayDate.toString().split(" ")[2];
        if (checkStr === checkToday) {
            return true;
        }
    });
    // //determine whether to return today's or yesterday's activity.
    // const timeline = req.params.timeline;
    // const date = new Date();
    // const year = date.getFullYear();
    // const month = date.getMonth();
    // const day = timeline == "yesterday" ? date.getDay() - 1 : date.getDay();
    // const startDate = new Date(year, month, day);
    // const endDate = new Date(year, month, day + 1);
    // const activities = await activityModel.find({ createdAt: startDate });
    if (activities.length === 0) {
        return res.json({ activities });
    }
    // const id = req.params.id;
    // const activity = await activityModel.findById(id);
    // const checkStr =
    //   activity.createdAt.toString().split(" ")[1] +
    //   activity.createdAt.toString().split(" ")[2];
    // console.log(typeof Date.now());
    // console.log(typeof activity.createdAt.toString());
    // console.log(activity.createdAt.toString());
    // const date = activity.createdAt.toString().split(" ");
    // res.send({
    //   activityDate: activity.createdAt,
    //   stringDate: activity.createdAt.toString(),
    //   splittedDate: date,
    //   todayDate,
    //   stringToday: todayDate.toString(),
    //   checkStr,
    // });
    res.json({
        activities,
    });
}
exports.getActivity = getActivity;
async function getYesterdayActivity(req, res) {
    const currentDate = new Date();
    try {
        const getAllActivity = await activity_1.default.find({});
        const getActivity = getAllActivity.filter((activity) => {
            const currentActMon = activity.createdAt.toString().split(" ")[1];
            const currActDate = parseInt(activity.createdAt.toString().split(" ")[2]);
            const getDate = currentActMon + " " + currActDate;
            const getCurrMonth = currentDate.toString().split(" ")[1];
            const getCurrDate = parseInt(currentDate.toString().split(" ")[2]) - 1;
            const yesterdayDate = getCurrMonth + " " + getCurrDate;
            if (getDate === yesterdayDate) {
                return true;
            }
        });
        if (getActivity.length === 0) {
            return res.json({ msg: "No activity created previously" });
        }
        res.send(getActivity);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
    // const getId = req.params.id;
    // const activities = await activityModel.findById(getId);
    // console.log(activities);
    // const getMonth = activities
    //   .filter((a: any) => {
    //     const b = a;
    //   })
    //   .createdAt.toString()
    //   .split(" ")[1];
    // const getDate = parseInt(activities.createdAt.toString().split(" ")[2]) - 1;
    // const previousDate = getMonth + " " + getDate;
    // console.log(previousDate);
    // console.log(getMonth);
    // console.log(typeof getMonth);
    // console.log(getDate);
    // console.log(typeof getDate);
}
exports.getYesterdayActivity = getYesterdayActivity;
