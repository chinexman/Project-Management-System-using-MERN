"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMembersToTeam = exports.createTeam = void 0;
const joi_1 = __importDefault(require("joi"));
const teamModel_1 = __importDefault(require("../models/teamModel"));
const projectModel_1 = __importDefault(require("../models/projectModel"));
const user_1 = __importDefault(require("../models/user"));
///jah'swill////////////////////////////////////
async function createTeam(req, res) {
    var _a;
    const { projectId } = req.params;
    const { teamName, about, } = req.body;
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
                    error: inputValidation.error.details[0].message
                });
                return;
            }
            const newTeam = await teamModel_1.default.create({
                teamName,
                about,
                "createdBy": ownerId,
                projectId
            });
            return res.json({
                messsage: "Team crated successfully",
                teamCreated: newTeam,
                membersStatus: "No members added"
            });
        }
        catch (err) {
            res.json({
                message: err
            });
        }
    }
}
exports.createTeam = createTeam;
//owner adding members to a team
async function addMembersToTeam(req, res) {
    var _a;
    const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { membersEmail } = req.body;
    const { teamId } = req.params;
    const team = await teamModel_1.default.findOne({ teamId });
    if (team) {
        const { createdBy, teamName } = team; /////how could i have dealt with this without using the if block
        if (ownerId !== team.createdBy) {
            return res.status(400).json({
                message: `Sorry, you can't add memebrs to team ${teamName}`
            });
        }
        const emails = membersEmail.split(",");
        let memberIds = emails.map(async (mail) => {
            let verifiedUser = await user_1.default.findOne({ email: mail });
            if (!verifiedUser) {
                return res.status(400).json({
                    message: `The email: ${mail} cannot be found`
                });
            }
            const { _id } = verifiedUser;
            return _id;
        });
    }
}
exports.addMembersToTeam = addMembersToTeam;
