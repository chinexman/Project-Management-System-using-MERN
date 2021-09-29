import mongoose from 'mongoose'
import { UserInterface } from '../interfaces/interface';

const userSchema = new mongoose.Schema({
                                                                                                        
    name: {
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
    }
});


const userModel = mongoose.model<UserInterface>("user", userSchema);

export default userModel;