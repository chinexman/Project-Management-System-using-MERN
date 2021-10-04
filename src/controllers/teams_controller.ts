import express, { Request, Response } from "express"
import Joi from "joi";
import Team from "../models/teamModel";
import Project from "../models/projectModel";
import UserModel from "../models/user";
import {User} from "../models/user";


type customRequest = Request & {
    user?: {_id?: string, email?: string, fullname?: string}
}

///jah'swill////////////////////////////////////
export async function createTeam(req: customRequest, res: Response){
  const { projectId }  = req.params
  const { teamName, about, } = req.body
  //check for project using Id
  const project = await Project.findOne({ projectId})
  const ownerId = req.user?._id
  if(project){
    const teamSchema = 
      Joi.object({
      teamName: Joi.string().trim().required(),
      about: Joi.string().trim().required(),
    });
    try {
        const inputValidation = await teamSchema.validate(req.body, {
          abortEarly: false, ///essence of this line
        })
        if(inputValidation.error) {
            console.log("validation error")
            res.status(400).json ({
              message: "Invalid input, check and try again",
              error: inputValidation.error.details[0].message
            })
            return;
        }

        const newTeam = await Team.create({
            teamName,
            about,
            "createdBy": ownerId,
            projectId
        })
        return res.json({
            messsage: "Team crated successfully",
            teamCreated: newTeam,
            membersStatus: "No members added"
        })

    }catch(err){
      res.json({
        message: err
      })
    }

  }
} 


//owner adding members to a team

export async function addMembersToTeam(req: customRequest, res: Response){
  const ownerId = req.user?._id
  const { membersEmail } = req.body
  const { teamId } = req.params
  const team = await Team.findOne({ teamId })
  if(team){
    const { createdBy, teamName } = team /////how could i have dealt with this without using the if block
    if(ownerId !== team.createdBy){
      return res.status(400).json({
        message: `Sorry, you can't add memebrs to team ${teamName}`
      })
    }
    const emails = membersEmail.split(",")
    let memberIds = emails.map(async (mail: string) => {
      let verifiedUser = await UserModel.findOne({email: mail.trim()})
      if(!verifiedUser) {
        return res.status(400).json({
          message: `The email: ${mail} cannot be found`
        })
      }
      const {  _id } = verifiedUser
      return _id
    })
  }
   
}


/////get all team members
export async function getALLTeamMembers(req: customRequest, res: Response){
  
}