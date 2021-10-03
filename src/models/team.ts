import { string } from "joi";
import mongoose from "mongoose";

export interface teamType {
    "teamName": String,
    "about": String,
    "team-members": String[],
    "productId": String

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
    "team-members" : {
        type: String,
        require: true //should it be required at creation
    },
    "productId": {
        type: String,
        require: true
    }

}, {timestamps: true}) 


const Team = mongoose.model<teamType>("Team", teamModel)

export default Team;