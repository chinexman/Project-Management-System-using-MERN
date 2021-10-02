import { boolean } from 'joi';
import mongoose from 'mongoose';
import teamsSchema from './collaboratorModel'


interface ProjectInterface {
    userId:string,
    projectname:string,
    collaborators:[{ email:string,isVerified:boolean}]
    createdAt:string,
    updatedAt:string

}



const projectsSchema = new  mongoose.Schema({
  userId: {
      type:String
  },
  projectname : {
      type:String,
      required:true,
      unique:true
  },
  collaborators: [{ email:String,isVerified:Boolean}]


},{
    timestamps:true
})

const Project = mongoose.model<ProjectInterface>('projects', projectsSchema);

export default Project;