"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTeamDetails = exports.getALLTeamMembers = exports.addMembersToTeam = exports.createTeam = void 0;
const joi_1 = __importDefault(require("joi"));
const teamModel_1 = __importDefault(require("../models/teamModel"));
const projectModel_1 = __importDefault(require("../models/projectModel"));
///jah'swill////////////////////////////////////
async function createTeam(req, res) {
    var _a;
    const { projectId } = req.params;
    const { teamName, about } = req.body;
    //check for project using Id
    const project = await projectModel_1.default.findOne({ projectId });
    const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (project) {
        const teamSchema = joi_1.default.object({
            teamName: joi_1.default.string().trim().required(),
            about: joi_1.default.string().trim().required(),
        });
        try {
            const inputValidation = await teamSchema.validate(req.body, {
                abortEarly: false, ///essence of this line
            });
            if (inputValidation.error) {
                console.log("validation error");
                res.status(400).json({
                    message: "Invalid input, check and try again",
                    error: inputValidation.error.details[0].message,
                });
                return;
            }
            const newTeam = await teamModel_1.default.create({
                teamName,
                about,
                createdBy: ownerId,
                projectId,
            });
            return res.json({
                messsage: "Team crated successfully",
                teamCreated: newTeam,
                membersStatus: "No members added",
            });
        }
        catch (err) {
            res.json({
                message: err,
            });
        }
    }
}
exports.createTeam = createTeam;
//owner adding members to a team
async function addMembersToTeam(req, res) {
    const { newMemberID } = req.body;
    const teamId = req.params.id;
    const user_id = req.user._id;
    const teamObj = await teamModel_1.default.findOne({ _id: teamId, createdBy: user_id });
    if (!teamObj) {
        return res.status(404).json({
            status: "failed",
            message: "Team does not exist",
        });
    }
    const alreadyMember = teamObj.members.includes(newMemberID);
    if (alreadyMember) {
        return res.status(400).json({
            status: "failed",
            message: "Member already exists in the team",
        });
    }
    teamObj.members.push(newMemberID);
    const updatedteam = await teamModel_1.default.findByIdAndUpdate({ _id: teamId }, { members: teamObj.members }, { new: true });
    res.status(201).json({
        status: "success",
        data: updatedteam,
    });
}
exports.addMembersToTeam = addMembersToTeam;
/////get all team members
async function getALLTeamMembers(req, res) { }
exports.getALLTeamMembers = getALLTeamMembers;
//update team details
async function updateTeamDetails(req, res) {
    const user_id = req.user._id;
    const project_id = req.params.id;
    const { teamName, about } = req.body;
    let findTeam = await teamModel_1.default.findOne({
        _id: project_id,
        createdBy: user_id,
    });
    if (!findTeam) {
        return res.status(404).json({
            status: "failed",
            message: "Team does not exist",
        });
    }
    let updatedTeam = await teamModel_1.default.findOneAndUpdate({ _id: req.params.id }, {
        teamName: teamName,
        about: about,
    }, { new: true });
    res.status(200).json({
        status: "success",
        data: updatedTeam,
    });
}
exports.updateTeamDetails = updateTeamDetails;
