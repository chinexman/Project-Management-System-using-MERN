import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    // lastName: {
    //     type: String,
    //     required: String
    // },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
})


const UserModel = mongoose.model('user', userSchema)

export default UserModel