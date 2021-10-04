import express, { Request, Response } from "express";
import Joi from "joi";
import Team from "../models/teamModel";
import Project from "../models/projectModel";
import UserModel from "../models/user";
import { User } from "../models/user";

type customRequest = Request & {
  user?: { _id?: string; email?: string; fullname?: string };
};

///jah'swill////////////////////////////////////
export async function createTeam(req: customRequest, res: Response) {
  const { projectId } = req.params;
  const { teamName, about } = req.body;
  //check for project using Id
  const project = await Project.findOne({ projectId });
  const ownerId = req.user?._id;
  if (project) {
    const teamSchema = Joi.object({
      teamName: Joi.string().trim().required(),
      about: Joi.string().trim().required(),
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

      const newTeam = await Team.create({
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
    } catch (err) {
      res.json({
        message: err,
      });
    }
  }
}

//owner adding members to a team

export async function addMembersToTeam(req: customRequest, res: Response) {
  const { newMemberID } = req.body;
  const teamId = req.params.id;
  const user_id = req.user!._id;
  const teamObj = await Team.findOne({ _id: teamId, createdBy: user_id });
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
  res.status(201).json({
    status: "success",
    data: teamObj,
  });
}

/////get all team members
export async function getALLTeamMembers(req: customRequest, res: Response) {}

//update team details
export async function updateTeamDetails(req: customRequest, res: Response) {
  const user_id = req.user!._id;
  const project_id = req.params.projectId;
  const { teamName, about } = req.body;
  let findTeam = await Team.findOne({
    projectId: project_id,
    createdBy: user_id,
  });
  if (!findTeam) {
    return res.status(404).json({
      status: "failed",
      message: "Team does not exist",
    });
  }
  let updatedTeam = await Team.findOneAndUpdate(
    { projectId: req.params.projectId },
    {
      teamName: teamName,
      about: about,
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: updatedTeam,
  });
}
