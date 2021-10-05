"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveTeam = exports.getAllTeamMembers = exports.addMemberToTeam = exports.createTeam = void 0;
const joi_1 = __importDefault(require("joi"));
const teamModel_1 = __importDefault(require("../models/teamModel"));
const projectModel_1 = __importDefault(require("../models/projectModel"));
///jah'swill////////////////////////////////////
async function createTeam(req, res) {
    var _a;
    const { projectId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { teamName, about } = req.body;
    try {
        const project = await projectModel_1.default.findOne({ _id: projectId, owner: userId });
        if (project) {
            const teamSchema = joi_1.default.object({
                teamName: joi_1.default.string().trim().required(),
                about: joi_1.default.string().trim().required(),
            });
            const inputValidation = await teamSchema.validate(req.body);
            if (inputValidation.error) {
                res.status(400).json({
                    message: 'Invalid input, check and try again',
                    error: inputValidation.error.details[0].message,
                });
                return;
            }
            const newTeam = await teamModel_1.default.create({
                teamName,
                about,
                createdBy: userId,
                projectId,
            });
            return res.json({
                messsage: 'Team created successfully.',
                teamCreated: newTeam,
                membersStatus: 'No members added',
            });
        }
    }
    catch (err) {
        res.json({
            message: err,
        });
    }
}
exports.createTeam = createTeam;
//owner adding members to a team
async function addMemberToTeam(req, res) {
    var _a;
    const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { memberId } = req.body; ///add team members email
    const { teamId } = req.params;
    try {
        const team = await teamModel_1.default.findOne({ _id: teamId, owner: ownerId });
        if (team) {
            let { createdBy, teamName, members } = team; /////how could i have dealt with this without using the if block
            let newteamMember = members.filter((val) => val === memberId);
            if (newteamMember.length !== 0) {
                return res.status(400).json({
                    message: `The member already existe on the team ${teamName}`,
                });
            }
            members.push(memberId); ///ensure this line of code works
            const updatedteam = await teamModel_1.default.findByIdAndUpdate({ _id: teamId }, { members: members }, { new: true });
            return res.status(201).json({
                message: `Successful `,
                updatedteam: updatedteam,
            });
        }
        return res.status(400).json({
            message: `Sorry, you don't have the permission to add memebrs to team you didn't create`,
        });
    }
    catch (err) {
        return res.status(400).json({
            message: err.message,
        });
    }
}
exports.addMemberToTeam = addMemberToTeam;
/////get all team members
async function getAllTeamMembers(req, res) {
    const { teamId } = req.params;
    try {
        const team = await teamModel_1.default.findOne({ _id: teamId });
        if (team) {
            var { members } = team; //use of var
            return res.status(200).json({
                message: 'successful',
                memebers: members,
                team: team,
            });
        }
        return res.status(400).json({
            Error: 'The team you request does not exist.',
        });
    }
    catch (err) {
        return res.status(400).json({
            error: err.message,
        });
    }
}
exports.getAllTeamMembers = getAllTeamMembers;
////leave a team//////////
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
