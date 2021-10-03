import { string } from "joi";
import mongoose from "mongoose";

export interface teamType {
    "teamName": String,
    "about": String,
    "team-members": teamMembersObj[],
    "projectId": String

}

interface teamMembersObj {
    "userId" : string,
    "email" : string
}

const teamModel = new mongoose.Schema({
    "teamName": {
        type: String,
        require: true
    },
    "about" : {
        type: String,
        require: true
    },
    "members" : [
        {type: mongoose.SchemaTypes.ObjectId}
    ],//cool
    "projectId": {
        type: String,
        require: true
    },
    "createdBy" : {
        type: String,
        require: true
    }

}, {timestamps: true}) 


const Team = mongoose.model<teamType>("Team", teamModel)

export default Team;