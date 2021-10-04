import express, { Request, Response } from 'express'
import Joi from 'joi'
import Team from '../models/teamModel'
import Project from '../models/projectModel'
import UserModel from '../models/user'
import { User } from '../models/user'

type customRequest = Request & {
  user?: { _id?: string; email?: string; fullname?: string }
}

///jah'swill////////////////////////////////////
export async function createTeam(req: customRequest, res: Response) {
  const { projectId } = req.params
  const userId = req.user?._id
  const { teamName, about } = req.body
  ///confirm the creator of the
  //check for project using Id
  const project = await Project.findOne({ _id: projectId, owner: userId })

  if (project) {
    const teamSchema = Joi.object({
      teamName: Joi.string().trim().required(),
      about: Joi.string().trim().required(),
    })
    try {
      const inputValidation = await teamSchema.validate(req.body)
      if (inputValidation.error) {
        console.log('validation error')
        res.status(400).json({
          message: 'Invalid input, check and try again',
          error: inputValidation.error.details[0].message,
        })
        return
      }

      const newTeam = await Team.create({
        teamName,
        about,
        createdBy: userId,
        projectId,
      })
      return res.json({
        messsage: 'Team created successfully.',
        teamCreated: newTeam,
        membersStatus: 'No members added',
      })
    } catch (err) {
      res.json({
        message: err,
      })
    }
  }
}

//owner adding members to a team

export async function addMemberToTeam(req: customRequest, res: Response) {
  const ownerId = req.user?._id
  const { memberId } = req.body ///add team members email
  const { teamId } = req.params
  const team = await Team.findOne({ _id: teamId, owner: ownerId })
  if (team) {
    let { createdBy, teamName, members } = team /////how could i have dealt with this without using the if block
    console.log('ownerId', ownerId, 'createdBy', createdBy)
    console.log(members, 'members')
    let newteamMember = members.filter((val) => val === memberId)
    if (newteamMember.length !== 0) {
      return res.status(400).json({
        message: `The member already existe on the team ${teamName}`,
      })
    }
    console.log(memberId, 'memberId')
    members.push(memberId) ///ensure this line of code works
    console.log(members, 'members')
    const updatedteam = await Team.findByIdAndUpdate(
      { _id: teamId },
      { members: members },
      { new: true }
    )
    return res.status(201).json({
      message: `Successful `,
      updatedMembers: members,
      team: team,
      updatedteam: updatedteam,
    })
  }
  return res.status(400).json({
    message: `Sorry, you don't have the permission to add memebrs to team you didn't create`,
  })
}

/////get all team members
export async function getAllTeamMembers(req: customRequest, res: Response) {
  const { teamId } = req.params
  console.log(teamId)
  try {
    const team = await Team.findOne({ _id: teamId })
    console.log(team)

    if (team) {
      var { members } = team //use of var
    }
    return res.status(200).json({
      message: 'successful',
      memebers: members,
      team: team,
    })
  } catch (err: any) {
    return res.status(400).json({
      error: err.message,
    })
  }
}

////leave a team//////////
export async function leaveTeam(req: customRequest, res: Response) {
  const { teamId } = req.params
  const id = req.user?._id
  const team = await Team.findOne({ _id: teamId })
  if (team) {
    const { members, teamName } = team
    const user = members.filter((val) => val.toString() === id?.toString())
    if (user.length == 0) {
      return res.status(400).json({
        message: `Sorry, you are not a member of team ${teamName}`,
      })
    }

    const updatedMembers = members.filter((val) => {
      return val.toString() !== id?.toString()
    })

    const updatedteam = await Team.findByIdAndUpdate(
      { _id: teamId },
      { members: updatedMembers },
      { new: true }
    )
    return res.status(200).json({
      message: `Successful removal from team ${teamName}`,
      updatedMembers: updatedMembers,
      updatedteam: updatedteam,
    })
  } else {
    return res.status(200).json({
      message: `Team doesn't exists`,
    })
  }
}
