import { string } from "joi";
import mongoose from "mongoose";

export interface teamType {
  teamName: String;
  about: String;
  members: string[];
  projectId: String;
  createdBy: string;
}

interface teamMembersObj {
  userId: string;
  email: string;
}

const teamModel = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    members: [{ type: mongoose.SchemaTypes.ObjectId }], //cool
    projectId: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Team = mongoose.model<teamType>("Team", teamModel);

export default Team;
