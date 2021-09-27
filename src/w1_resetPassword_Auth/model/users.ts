import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
type userFormat = {
    name: string,
    email: string | boolean,
    password: string,
    tokens: { [key: string]: string }[]
}

const signUpSchema = new mongoose.Schema<userFormat>({
    name: {
        type: String,
        required: [true, "Please do input your name"]
    },
    email: {
        type: String,
        required: [true, "Please do input your email"],
        unique: true, 
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8
    }
    // ,
    // tokens: [
    //     {
    //         token: String,
    //     }
    // ]
})

signUpSchema.pre('save', async function (next: () => void){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

const SignUp = mongoose.model('SignUp', signUpSchema);
export default SignUp;
