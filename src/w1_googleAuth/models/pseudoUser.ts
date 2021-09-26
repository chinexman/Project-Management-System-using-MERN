import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  google_id: {
    type: String,
  },
  user: {
    type: String,
  },
  email: {
    type: String,
  },
});

export default mongoose.model("googleUser", userSchema);
