

import express, { Response, Request } from 'express';
import Project from '../models/projectsModel';
import Team from '../models/teamsModel';
import joi from 'joi';
import sendMail from '../utils/nodeMailer';
type customRequest = Request & {
    user?: { _id?: string, email?: string, fullname?: string },

}

async function createProject(req: customRequest, res: Response) {


    const user_id = req.user?._id;

    const projectsSchema = joi.object({
        projectname: joi.string().min(3).max(255).required()

    })

    const projectValidate = projectsSchema.validate(req.body);
    if (projectValidate.error) {
        return res.status(400).json({
            message: projectValidate.error.details[0].message
        })
    }

    let findProject = await Project.findOne({ userId: user_id })
    if (findProject) {
        res.status(400).json({
            message: "Project name already exist"
        })
    }


    let projectObject = req.body;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    projectObject = { ...projectObject, createdAt, updatedAt }


    let team = projectObject.teams;



    const ProjectIN = await Project.create({
        userId: user_id,
        projectname: projectObject.projectname,
        teams: team,
        createdAt: projectObject.createdAt,
        updatedAt: projectObject.updatedAt
    });

    res.status(201).json({
        status: "success",
        data: ProjectIN
    })

}

async function createInvite(req: customRequest, res: Response) {

    const {email} = req.body;
    console.log(email);
    const fullname = req.user?.fullname;
    const user_id = req.user?._id;

    const emailSchema = joi.object({
        email: joi.string().required().min(6).max(225).email(),

    })

    const emailValidate = emailSchema.validate(req.body);
    if (emailValidate.error) {
        return res.status(400).json({
            message: emailValidate.error.details[0].message
        })
    }


    let findProject = await Project.findOne({ userId: user_id })
    if (findProject) {
        console.log(findProject.teams);
        findProject.teams.push(email);
        await findProject.save();
    }
    console.log(findProject);

    //     let updatedProject = await Project.findOneAndUpdate({ userId: user_id }, { teams: email }, { new: true });
    //    console.log(updatedProject)

    const link = `http://localhost:3000/user/invite/`

    const body = `
   You have be invited by ${fullname}
   to join the teams. please click on this link ${link}`;

    sendMail(email, body);

    res.status(200).json({

        message: `email invite have been sent to ${email}`
    })

}

async function updateProject(req: customRequest, res: Response) {

}

export {
    createProject,
    updateProject,
    createInvite
}


