import mongoose from 'mongoose';

interface collaboratorInterface {
    userId : string,
    projectId: string,
    collaborators: string,
    createdAt:string,
    updatedAt:string
}

const collaboratorsSchema = new mongoose.Schema({


    userId: {
        type:String
    },
    projectId:{
        type:String
    },
    collaborators:{
        type:String,
        required:true,
        unique: true
    }


},{
    timestamps:true
})

const collaborator = mongoose.model('collaborators',collaboratorsSchema);

export default collaborator