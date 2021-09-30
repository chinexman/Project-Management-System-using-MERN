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
  facebookId: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
    required: false,
  },
});

interface User {
  fullname?: string;
  email?: string;
  password?: string;
  facebookId?: string;
  googleId?: string;
}

const UserModel = mongoose.model<User>("user", userSchema);

export default UserModel;
