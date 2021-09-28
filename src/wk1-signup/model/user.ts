import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

interface User {
  fullname: string;
  email: string;
  password: string;
}

const UserModel = mongoose.model<User>("user", userSchema);

export default UserModel;
