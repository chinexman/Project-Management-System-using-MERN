"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvite = exports.updateProject = exports.createProject = void 0;
const projectsModel_1 = __importDefault(require("../models/projectsModel"));
const joi_1 = __importDefault(require("joi"));
const nodeMailer_1 = __importDefault(require("../utils/nodeMailer"));
async function createProject(req, res) {
    var _a;
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const projectsSchema = joi_1.default.object({
        projectname: joi_1.default.string().min(3).max(255).required()
    });
    const projectValidate = projectsSchema.validate(req.body);
    if (projectValidate.error) {
        return res.status(400).json({
            message: projectValidate.error.details[0].message
        });
    }
    let findProject = await projectsModel_1.default.findOne({ userId: user_id });
    if (findProject) {
        res.status(400).json({
            message: "Project name already exist"
        });
    }
    let projectObject = req.body;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    projectObject = { ...projectObject, createdAt, updatedAt };
    let team = projectObject.teams;
    const ProjectIN = await projectsModel_1.default.create({
        userId: user_id,
        projectname: projectObject.projectname,
        teams: team,
        createdAt: projectObject.createdAt,
        updatedAt: projectObject.updatedAt
    });
    res.status(201).json({
        status: "success",
        data: ProjectIN
    });
}
exports.createProject = createProject;
async function createInvite(req, res) {
    var _a, _b;
    const { email } = req.body;
    console.log(email);
    const fullname = (_a = req.user) === null || _a === void 0 ? void 0 : _a.fullname;
    const user_id = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
    const emailSchema = joi_1.default.object({
        email: joi_1.default.string().required().min(6).max(225).email(),
    });
    const emailValidate = emailSchema.validate(req.body);
    if (emailValidate.error) {
        return res.status(400).json({
            message: emailValidate.error.details[0].message
        });
    }
    let findProject = await projectsModel_1.default.findOne({ userId: user_id });
    if (findProject) {
        console.log(findProject.teams);
        findProject.teams.push(email);
        await findProject.save();
    }
    console.log(findProject);
    //     let updatedProject = await Project.findOneAndUpdate({ userId: user_id }, { teams: email }, { new: true });
    //    console.log(updatedProject)
    const link = `http://localhost:3000/user/invite/`;
    const body = `
   You have be invited by ${fullname}
   to join the teams. please click on this link ${link}`;
    (0, nodeMailer_1.default)(email, body);
    res.status(200).json({
        message: `email invite have been sent to ${email}`
    });
}
exports.createInvite = createInvite;
async function updateProject(req, res) {
}
exports.updateProject = updateProject;
