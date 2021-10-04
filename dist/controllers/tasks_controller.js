"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileCloudinary = exports.getAllTasks = exports.deleteTask = exports.createTask = void 0;
const task_1 = __importDefault(require("../models/task"));
const cloudinary_1 = require("../utils/cloudinary");
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
async function deleteTask(req, res) {
    const taskId = await task_1.default.findById({ _id: req.params.id });
    if (!taskId) {
        return res.status(404).send("No task with the id ${taskId} exists");
    }
    try {
        await taskId.remove();
        res.status(200).json({
            msg: "Task with that id deleted from database successfully",
            details: taskId,
        });
    }
    catch (err) {
        res.status(400).json({ msg: err });
    }
}
exports.deleteTask = deleteTask;
async function getAllTasks(req, res) {
    try {
        const getTasks = await task_1.default.find({});
        console.log(getTasks);
        if (getTasks.length < 1) {
            return res.status(404).json({ msg: "No task created yet" });
        }
        res.status(200).json({ msg: getTasks });
    }
    catch (err) {
        res.status(400).send(err);
    }
}
exports.getAllTasks = getAllTasks;
async function uploadFileCloudinary(req, res) {
    const file = req.file;
    if (!req.file) {
        return res.status(400).json({
            msg: "no file was uploaded.",
        });
    }
    const response = await (0, cloudinary_1.cloudinaryUpload)(file === null || file === void 0 ? void 0 : file.originalname, file === null || file === void 0 ? void 0 : file.buffer);
    if (!response) {
        return res.status(500).json({
            msg: "Unable to upload file. please try again.",
        });
    }
    //data to keep
    const file_secure_url = response.secure_url;
    //done with processing.
    res.json({
        msg: "file uploaded successfully.",
        fileUrl: file_secure_url,
    });
}
exports.uploadFileCloudinary = uploadFileCloudinary;
//   //define storagefor the images
//   const storage = multer.diskStorage({
//     //destination for files
//     destination: (req: Request, file: any, cb: any) => {
//       cb(null, "../public/files");
//     },
//     //add back the extension that was striped out by multer
//     filename: (req: Request, file: any, cb: any) => {
//       cb(null, Date.now() + file.originalname);
//     },
//   });
//   //upload parameter for multer
//   const upload = multer({
//     storage: storage,
//     limits: {
//       fieldSize: 1024 * 1024 * 3, //3mb
//     },
//   });
// }
