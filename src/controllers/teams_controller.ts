import express, { Request, Response } from 'express'
import Joi from 'joi'
import Team from '../models/teamModel'
import Project from '../models/projectModel'
import taskModel from '../models/task'
import UserModel from '../models/user'

type customRequest = Request & {
  user?: { _id?: string; email?: string; fullname?: string }
}

export async function createTeam(req: customRequest, res: Response) {
  const { projectId } = req.params
  const { teamName, about } = req.body
  console.log(projectId)
  //check for project using Id
  try {
    const project = await Project.findOne({ _id: projectId })
    const ownerId = req.user?._id
    console.log(project)
    if (!project) {
      return res.status(404).json({
        status: 'failed',
        message: 'This project does not exist.',
      })
    }
    const teamSchema = Joi.object({
      teamName: Joi.string().trim().required(),
      about: Joi.string().trim().required(),
    })
    const inputValidation = await teamSchema.validate(req.body, {
      abortEarly: false, ///essence of this line
    })
    if (inputValidation.error) {
      res.status(400).json({
        message: 'Invalid input, check and try again',
        error: inputValidation.error.details[0].message,
      })
      return
    }
    const sameName = await Team.exists({ teamName })
    console.log(sameName)

    if (sameName) {
      res.status(400).json({
        message: 'The group name is already taken.',
      })
      return
    }
    const newTeam = await Team.create({
      teamName,
      about,
      createdBy: ownerId,
      projectId,
    })
    return res.status(201).json({
      message: 'Team created successfully',
      teamCreated: newTeam,
      membersStatus: 'No members added',
    })
  } catch (err) {
    res.json({
      message: err,
    })
  }
}

//owner adding members to a team
export async function addMemberToTeam(req: customRequest, res: Response) {
  const { newMemberID } = req.body
  const teamId = req.params.teamId
  const user_id = req.user!._id
  try {
    const teamExist = await Team.exists({ _id: teamId })
    if (!teamExist) {
      return res.status(404).json({
        msg: 'Team does not exist.',
      })
    }
    const team = await Team.findOne({ _id: teamId, createdBy: user_id })
    if (team !== null) {
      const alreadyMember = team.members.includes(newMemberID)
      if (alreadyMember) {
        return res.status(400).json({
          status: 'failed',
          message: 'Member already exists in the team',
        })
      }
      team.members.push(newMemberID)

      const updatedteam = await Team.findByIdAndUpdate(
        { _id: teamId },
        { members: team.members },
        { new: true }
      )

      return res.status(200).json({
        status: 'success',
        data: updatedteam,
      })
    } else {
      return res.status(404).json({
        status: 'failed',
        message: "You don't have access to add members to this team.",
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: 'failed',
      message: error,
    })
  }
}

//update team details
export async function updateTeamDetails(req: customRequest, res: Response) {
  const user_id = req.user!._id
  const project_id = req.params.id
  const { teamName, about } = req.body

  try {
    let findTeam = await Team.findOne({
      _id: project_id,
      createdBy: user_id,
    })
    if (!findTeam) {
      return res.status(404).json({
        status: 'failed',
        message: 'Team does not exist',
      })
    }
    let updatedTeam = await Team.findOneAndUpdate(
      { _id: req.params.id },
      {
        teamName: teamName,
        about: about,
      },
      { new: true }
    )
    res.status(200).json({
      status: 'success',
      data: updatedTeam,
    })
  } catch (error) {
    res.status(200).json({
      status: 'Failed',
      Error: error,
    })
  }
}

//get all team members
export async function getAllTeamMembers(req: customRequest, res: Response) {
  const { teamId } = req.params

  try {
    const team = await Team.findOne({ _id: teamId })

    if (!team) {
      return res.status(400).json({
        Status: 'Failed',
        message: 'Team does not exists',
      })
    }
    var { members } = team //use of var
    return res.status(200).json({
      message: 'successful',
      members: members,
      team: team,
    })
  } catch (err: any) {
    return res.status(400).json({
      error: err.message,
    })
  }
}

//leave a team
export async function leaveTeam(req: customRequest, res: Response) {
  const { teamId } = req.params
  const id = req.user?._id
  try {
    const team = await Team.findOne({ _id: teamId })

    if (!team) {
      return res.status(200).json({
        message: `Team doesn't exists`,
      })
    }

    const { members, teamName } = team
    const user = members.filter((val) => val.toString() == id?.toString()) //the USE OF loose equality
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
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    })
  }
}

///get information for all teammabers
export async function getUserDetails(req: customRequest, res: Response) {
  const { teamId } = req.params
  const teamInfo = await Team.findOne({ _id: teamId })
  try {
    if (!teamInfo) {
      return res.status(400).json({
        message: "Team doesn't exists",
      })
    }

    const teamMembersArray = teamInfo.members
    console.log(teamMembersArray, 'teamMembersArray')
    const memberInfo = teamMembersArray.map(async (memberId: string) => {
      console.log('This is the member info block of code')
      let member = await UserModel.findOne({ _id: memberId })

      let assignedTasks = await taskModel.find({ assignee: memberId })
      let closedTasks = await taskModel.find({
        assignee: memberId,
        status: 'done',
      })

      let numberOfAssignedTasks = assignedTasks.length
      let numberOfClosedtasks = closedTasks.length
      let numberOfOpenedtasks = numberOfAssignedTasks - numberOfClosedtasks

      const userDetails = {
        fullname: member?.fullname,
        role: member?.role,
        location: member?.location,
        numberOfClosedtasks: numberOfClosedtasks,
        numberOfOpenedtasks: numberOfOpenedtasks,
      }
      console.log(userDetails, 'userDetails')
      return userDetails
    })
    console.log(memberInfo, 'memberInfo')

    const memberObj = await Promise.all(memberInfo)
    console.log(memberObj)
    return res.status(200).json({
      message: 'success',
      userDetails: memberObj,
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Failed',
      error: error,
    })
  }
}
