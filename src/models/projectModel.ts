import { boolean } from 'joi';
import mongoose from 'mongoose';



export interface ProjectInterface {
    owner: string,
    name: string,
    collaborators: [{ email: string, isVerified: boolean }]
    createdAt: string,
    updatedAt: string

}



const projectsSchema = new mongoose.Schema({
    owner: {
        type: String,
        required:true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    collaborators: [{ email: String, isVerified: Boolean }]

}, {
    timestamps: true
})

const Project = mongoose.model<ProjectInterface>('projects', projectsSchema);


export default Project;