import mongoose from "mongoose";
const findOrCreate = require("mongoose-findorcreate");

interface userInterface {
  facebookId: String;
  fullname: String;
}

const userSchema = new mongoose.Schema(
  {
    facebookId: {
      type: String,
      required: [true, "id is required"],
    },
    fullname: {
      type: String,
      required: [true, "fullname is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
  },
  { timestamps: true }
);
userSchema.plugin(findOrCreate);
const User = mongoose.model("FBusers", userSchema);

export { User }
// export default User;
