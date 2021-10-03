"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeam = void 0;
const joi_1 = __importDefault(require("joi"));
const team_1 = __importDefault(require("../models/team"));
const projectModel_1 = __importDefault(require("../models/projectModel"));
///jah'swill////////////////////////////////////
async function createTeam(req, res) {
    const { projectId } = req.params;
    //check for project using Id
    const project = await projectModel_1.default.findOne({ projectId });
    if (project) {
        const { teamName, about } = req.body;
        const ownerId = project.owner; ///i hope this is the owners id....///check out to create a project
        const teamSchema = joi_1.default.object({
            teamName: joi_1.default.string().trim().required(),
            about: joi_1.default.string().trim().required(),
            //   members: Joi.string().trim()//making this fiels not required so an empty array can be stored in DB,//how to mak ethi sfield not compulsory
            //inputting the emails of tea members and using thi sto check the user Db to find the id's to save
        });
        try {
            const inputValidation = await teamSchema.validate(req.body, {
                abortEarly: false, ///essence of this line
            });
            if (inputValidation.error) {
                console.log("validation error");
                res.status(400).json({
                    message: "Invalid input, check and try again",
                    error: inputValidation.error
                });
                return;
            }
            // var membersEmail = members.split(",")///singular use of var bCus of line 45
            // console.log(membersEmail)
            // let membersId = membersEmail.map(async (mail: string) => await UserModel.findOne({email: mail}))
            // let checkForNull = membersId.filter((elem: User ) => elem === null)
            // if(checkForNull)
            //     const newTeam = await Team.create({
            //         teamName,
            //         about,
            //         // "members": membersEmail,
            //         "createdBy": ownerId,
            //         projectId
            //     return res.json({
            //         messsage: "Team crated successfully",
            //         teamCreated: newTeam,
            //         membersStatus: "members added"
            //     })
            // }
            const newTeam = await team_1.default.create({
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
