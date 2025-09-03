import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    require: true
  },
  username: {
    type: String,
    require: true
  },
})

const User = mongoose.model("User", userSchema)

export default User;