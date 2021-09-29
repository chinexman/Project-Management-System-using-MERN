import mongoose from 'mongoose'
interface ProfileInterface{
  userId:string,
  email:string,
  firstName: string
  lastName: string,
  gender : string,
  role:string,
  location :string,
  about:string,
  profileImage: string,
  createdAt: string,
  updatedAt: string

}
const profileSchema = new mongoose.Schema({

   
    userId:{
    type:String
     },
     email:{
       type:String,
     },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
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
    }   
   
}, {timestamps: true});


const Profile = mongoose.model<ProfileInterface>("Profile", profileSchema);

export default Profile;