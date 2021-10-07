import Project from "../models/projectModel";
import express, { Response, Request } from "express";
import projectModel, { ProjectInterface } from "../models/projectModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import joi from "joi";
import sendMail from "../utils/nodemailer";
import UserModel, { User } from "../models/user";
type customRequest = Request & {
  user?: { _id?: string; email?: string; fullname?: string };
};

async function createProject(req: customRequest, res: Response) {
  const user_id = req.user?._id;

  const { projectname } = req.body;
  const projectsSchema = joi.object({
    projectname: joi.string().min(3).max(255).required(),
  });

  const projectValidate = projectsSchema.validate(req.body);

  if (projectValidate.error) {
    return res.status(400).json({
      message: projectValidate.error.details[0].message,
    });
  }

  let findProject = await projectModel.findOne({ name: projectname });
  if (findProject) {
    res.status(400).json({
      message: "Project name already exist",
    });
  }

  const newProject = await projectModel.create({
    owner: user_id,
    name: projectname,
    collaborators: [],
  });

  return res.status(201).json({
    status: "success",
    data: newProject,
  });
}

async function updateProject(req: customRequest, res: Response) {
  //extract details
  const user_id = req.user?._id;
  const projectId = req.params.projectId;
  const { projectname } = req.body;
  //validating
  const projectSchema = joi.object({
    projectname: joi.string().min(3).max(255).required(),
  });
  //error messages
  const projectUpdate = projectSchema.validate(req.body);
  if (projectUpdate.error) {
    return res.status(400).json({
      message: projectUpdate.error.details[0].message,
    });
  }
  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({
      msg: "Project does not exist.",
    });
  }

  if (project.owner !== user_id?.toString()) {
    return res.status(403).json({
      msg: "You are not authorized to update this project.",
    });
  }

  //accessing database
  let updateProject = await Project.findOneAndUpdate(
    { _id: projectId },
    { name: projectname },
    { new: true }
  );
  res.status(200).json({
    updatedProject: updateProject,
  });
}

async function createInvite(req: customRequest, res: Response) {
  let { email, projectname } = req.body;
  const fullname = req.user?.fullname;
  const user_id = req.user?._id;
  const isVerified: boolean = false;
  const emailSchema = joi.object({
    email: joi.string().required().min(6).max(225).email(),
    projectname: joi.string().min(3).max(255).required(),
  });

  const emailValidate = emailSchema.validate(req.body);
  if (emailValidate.error) {
    return res.status(400).json({
      message: emailValidate.error.details[0].message,
    });
  }

  let isVerifiedEmail: User | null;
  let body: string = "";
  let findProject = await projectModel.findOne({
    owner: user_id,
    name: projectname,
  });
  if (!findProject)
    return res.status(400).json({
      message: ` ${projectname} does not exist on this user`,
    });

  if (email === req.user?.email) {
    return res.status(400).json({
      message: "You cannot invite yourself.",
    });
  }

  isVerifiedEmail = await UserModel.findOne({ email: email });
  if (!isVerifiedEmail) {
    findProject.collaborators.push({ email: email, isVerified: false });
    await findProject.save();
    const token = jwt.sign(
      { owner: user_id, projectId: findProject?._id, email: email },
      process.env.JWT_SECRETKEY as string,
      { expiresIn: process.env.JWT_EMAIL_EXPIRES as string }
    );

    const link = `${process.env.HOME_URL}:${process.env.PORT}/users/inviteUser/${token}`;

    body = `
                You have be invited by ${fullname}
                to join the ${findProject.name}project. please click on this link ${link}`;

    if (process.env.NODE_ENV != "test") {
      sendMail(email, body);
    }

    return res.status(200).json({
      message: `email invite have been sent to ${email}`,
      token: link,
    });
  } else {
    findProject.collaborators.push({ email: email, isVerified: true });

    body = `
                  You have be invited by ${fullname}
                  to  the ${findProject.name}project.`;

    if (process.env.NODE_ENV != "test") {
      sendMail(email, body);
    }
    return res.status(200).json({
      message: `${email} have been added to ${findProject.name}project`,
    });
  }
}
// Logic to get all prjects
async function getAllProject(req: customRequest, res: Response) {
  //extract details
  const user_id = req.user?._id;
  const projects = await Project.find({
    $or: [{ owner: user_id }, { "collaborators.email": req.user?.email }],
  });
  if (projects.length === 0) {
    res.status(404).json({
      msg: "There are no projects available.",
    });
  } else {
    res.status(200).json({ projects });
  }
}

export { createProject, updateProject, createInvite, getAllProject };
