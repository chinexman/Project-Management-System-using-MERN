"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProject = exports.createInvite = exports.updateProject = exports.createProject = void 0;
const projectModel_1 = __importDefault(require("../models/projectModel"));
const projectModel_2 = __importDefault(require("../models/projectModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
const nodemailer_1 = __importDefault(require("../utils/nodemailer"));
const user_1 = __importDefault(require("../models/user"));
async function createProject(req, res) {
    var _a;
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { projectname } = req.body;
    console.log(projectname);
    const projectsSchema = joi_1.default.object({
        projectname: joi_1.default.string().min(3).max(255).required(),
    });
    const projectValidate = projectsSchema.validate(req.body);
    if (projectValidate.error) {
        return res.status(400).json({
            message: projectValidate.error.details[0].message,
        });
    }
    let findProject = await projectModel_2.default.findOne({ name: projectname });
    console.log(findProject);
    if (findProject) {
        res.status(400).json({
            message: "Project name already exist",
        });
    }
    const newProject = await projectModel_2.default.create({
        owner: user_id,
        name: projectname,
        collaborators: [],
    });
    return res.status(201).json({
        status: "success",
        data: newProject,
    });
}
exports.createProject = createProject;
async function updateProject(req, res) {
    var _a;
    //extract details
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { projectname } = req.body;
    //validating
    const projectSchema = joi_1.default.object({
        projectname: joi_1.default.string().min(3).max(255).required()
    });
    //error messages 
    const projectUpdate = projectSchema.validate(req.body);
    if (projectUpdate.error) {
        return res.status(400).json({
            message: projectUpdate.error.details[0].message
        });
    }
    //accessing database
    let updateProject = await projectModel_1.default.findByIdAndUpdate(user_id, { projectname: projectname }, { new: true });
    res.status(200).json({
        "updatedProject": updateProject
    });
}
exports.updateProject = updateProject;
async function createInvite(req, res) {
    var _a, _b;
    let { email, projectname } = req.body;
    const fullname = (_a = req.user) === null || _a === void 0 ? void 0 : _a.fullname;
    const user_id = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
    const isVerified = false;
    const emailSchema = joi_1.default.object({
        email: joi_1.default.string().required().min(6).max(225).email(),
        projectname: joi_1.default.string().min(3).max(255).required()
    });
    const emailValidate = emailSchema.validate(req.body);
    if (emailValidate.error) {
        return res.status(400).json({
            message: emailValidate.error.details[0].message
        });
    }
    let isVerifiedEmail;
    let body = "";
    let findProject = await projectModel_2.default.findOne({ owner: user_id, name: projectname });
    if (!findProject)
        return res.status(400).json({
            message: ` ${projectname} does not exist on this user`
        });
    isVerifiedEmail = await user_1.default.findOne({ email: email });
    if (!isVerifiedEmail) {
        findProject.collaborators.push({ email: email, isVerified: false });
        await findProject.save();
        const token = jsonwebtoken_1.default.sign({ owner: user_id, projectId: findProject === null || findProject === void 0 ? void 0 : findProject._id, email: email }, process.env.JWT_SECRETKEY, { expiresIn: process.env.JWT_EMAIL_EXPIRES });
        const link = `${process.env.HOME_URL}:${process.env.PORT}/users/inviteUser/${token}`;
        body = `
                You have be invited by ${fullname}
                to join the ${findProject.name}project. please click on this link ${link}`;
        if (process.env.NODE_ENV != "test") {
            (0, nodemailer_1.default)(email, body);
        }
        return res.status(200).json({
            message: `email invite have been sent to ${email}`,
            token: link
        });
    }
    else {
        findProject.collaborators.push({ email: email, isVerified: true });
        body = `
                  You have be invited by ${fullname}
                  to  the ${findProject.name}project.`;
        if (process.env.NODE_ENV != "test") {
            (0, nodemailer_1.default)(email, body);
        }
        return res.status(200).json({
            message: `${email} have been added to ${findProject.name}project`,
        });
    }
}
exports.createInvite = createInvite;
// Logic to get all prjects 
async function getAllProject(req, res) {
    var _a, _b;
    //extract details
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const projects = await projectModel_1.default.find({ $or: [{ owner: user_id }, { "collaborators.email": (_b = req.user) === null || _b === void 0 ? void 0 : _b.email }] });
    if (projects.length === 0) {
        res.status(404).json({
            msg: 'There are no projects available.'
        });
    }
    else {
        res.status(200).json({ projects });
    }
}
exports.getAllProject = getAllProject;
