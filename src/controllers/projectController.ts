

import express, { Response, Request } from 'express';
import Project from '../models/projectModel';
import jwt, {JwtPayload} from 'jsonwebtoken';
import joi from 'joi';
import sendMail from '../utils/nodemailer';
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
    const { projectname } = req.body
    let findProject = await Project.findOne({ projectname })////checking the project by the owner instead of the prject name
    if (findProject) {
      return  res.status(400).json({
            message: "Project name already exist"
        })
    }


    let projectObject = req.body;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    projectObject = { ...projectObject, createdAt, updatedAt }


    let collaborator = projectObject.collaborators;



    const ProjectIN = await Project.create({
        owner: user_id,
        projectname: projectname,
        collaborators:[] ///how are we going to add collaborators
        // createdAt: projectObject.createdAt,
        // updatedAt: projectObject.updatedAt
    });

    res.status(201).json({
        status: "success",
        data: ProjectIN
    })

}

async function createInvite(req: customRequest, res: Response) {

    const {email, projectname} = req.body;
    
    console.log(email);
    const fullname = req.user?.fullname;
    const user_id = req.user?._id;
    const isVerified :boolean = false;
    const emailSchema = joi.object({
        email: joi.string().required().min(6).max(225).email(),
        projectname: joi.string().min(3).max(255).required()


    })

    const emailValidate = emailSchema.validate(req.body);
    if (emailValidate.error) {
        return res.status(400).json({
            message: emailValidate.error.details[0].message
        })
    }


    let findProject = await Project.findOne({ owner: user_id ,projectname:projectname})
    if (findProject) {
        console.log(findProject.collaborators);
        findProject.collaborators.push({email:email, isVerified:isVerified});
        await findProject.save();
    }
    console.log(findProject);

    //     let updatedProject = await Project.findOneAndUpdate({ owner: user_id }, { collaborators: email }, { new: true });
    //    console.log(updatedProject)


  const token = jwt.sign({owner:user_id, findProjectId: findProject?._id,email:email}, 
    process.env.JWT_SECRETKEY as string, {
       expiresIn: process.env.JWT_EMAIL_EXPIRES as string

  })


    const link = `http://localhost:3000/user/invite/createinvite${token}`

    const body = `
   You have be invited by ${fullname}
   to join the collaborators. please click on this link ${link}`;

    sendMail(email, body);

    res.status(200).json({

        message: `email invite have been sent to ${email}`,
        token : link
    })

}

async function updateProject(req: customRequest, res: Response) {

}

async function verifyCreateInvite(req:customRequest, res:Response){

}

export {
    createProject,
    updateProject,
    createInvite,
    verifyCreateInvite
}


