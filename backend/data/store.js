import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: String,
  username: String,
})

const User = mongoose.model("User", userSchema)

export default User;