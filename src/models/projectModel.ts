import { boolean } from 'joi';
import mongoose from 'mongoose';



interface ProjectInterface {
    owner:string,
    projectname:string,
    collaborators:[{ email:string,isVerified:boolean}]
    createdAt:string,
    updatedAt:string

}



const projectsSchema = new  mongoose.Schema({
  owner: {
      type:String
  },
  projectname : {
      type:String,
      required:true,
      unique:true
  },
  collaborators: [{ email:String,isVerified:Boolean}]
// collaborators:[{type:mongoose.schemaTypes.ObjectId, ref:"collaborator"}]


},{
    timestamps:true
})

const Project = mongoose.model<ProjectInterface>('projects', projectsSchema);

export default Project;