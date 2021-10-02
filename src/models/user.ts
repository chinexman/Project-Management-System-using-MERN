import mongoose from "mongoose";
interface User {
  fullname?: string;
  email?: string;
  password?: string;
  facebookId?: string;
  googleId?: string;
}
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
  gender: {
    type: String,
  },
  role: {
    type: String,
  },
  location: {
    type: String,
  },
  about: {
    type: String,
  },
  profileImage: {
    type: String,
  },
});
const UserModel = mongoose.model<User>("user", userSchema);
export default UserModel;
