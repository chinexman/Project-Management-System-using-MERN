"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveTeam = exports.getAllTeamMembers = exports.updateTeamDetails = exports.addMemberToTeam = exports.createTeam = void 0;
const joi_1 = __importDefault(require("joi"));
const teamModel_1 = __importDefault(require("../models/teamModel"));
const projectModel_1 = __importDefault(require("../models/projectModel"));
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
async function addMemberToTeam(req, res) {
    const { newMemberID } = req.body;
    const teamId = req.params.id;
    const user_id = req.user._id;
    const teamExist = await teamModel_1.default.exists({ _id: teamId });
    if (!teamExist) {
        return res.status(404).json({
            msg: "Team does not exist.",
        });
    }
    const team = await teamModel_1.default.findOne({ _id: teamId, createdBy: user_id });
    if (team !== null) {
        const alreadyMember = team.members.includes(newMemberID);
        if (alreadyMember) {
            return res.status(400).json({
                status: "failed",
                message: "Member already exists in the team",
            });
        }
        team.members.push(newMemberID);
        const updatedteam = await teamModel_1.default.findByIdAndUpdate({ _id: teamId }, { members: team.members }, { new: true });
        return res.status(201).json({
            status: "success",
            data: updatedteam,
        });
    }
    else {
        return res.status(404).json({
            status: "failed",
            message: "You don't have access to add members to this team.",
        });
    }
}
exports.addMemberToTeam = addMemberToTeam;
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
//get all team members
async function getAllTeamMembers(req, res) {
    const { teamId } = req.params;
    try {
        const team = await teamModel_1.default.findOne({ _id: teamId });
        if (team) {
            var { members } = team; //use of var
            return res.status(200).json({
                message: "successful",
                memebers: members,
                team: team,
            });
        }
        return res.status(400).json({
            Error: "The team you request does not exist.",
        });
    }
    catch (err) {
        return res.status(400).json({
            error: err.message,
        });
    }
}
exports.getAllTeamMembers = getAllTeamMembers;
//leave a team
async function leaveTeam(req, res) {
    var _a;
    const { teamId } = req.params;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
        const team = await teamModel_1.default.findOne({ _id: teamId });
        if (team) {
            const { members, teamName } = team;
            const user = members.filter((val) => val.toString() == (id === null || id === void 0 ? void 0 : id.toString())); //the USE OF loose equality
            if (user.length == 0) {
                return res.status(400).json({
                    message: `Sorry, you are not a member of team ${teamName}`,
                });
            }
            const updatedMembers = members.filter((val) => {
                return val.toString() !== (id === null || id === void 0 ? void 0 : id.toString());
            });
            const updatedteam = await teamModel_1.default.findByIdAndUpdate({ _id: teamId }, { members: updatedMembers }, { new: true });
            return res.status(200).json({
                message: `Successful removal from team ${teamName}`,
                updatedMembers: updatedMembers,
                updatedteam: updatedteam,
            });
        }
        else {
            return res.status(200).json({
                message: `Team doesn't exists`,
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}
exports.leaveTeam = leaveTeam;
