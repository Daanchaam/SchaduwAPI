import mongoose, { Schema, Document } from "mongoose";
import { Role } from "./roleModel";

export interface User extends Document {
  email: string;
  password: string;
  displayName: string;
  role: Role;
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  displayName: {
    type: String,
  },
  role: {
    type: String,
    default: Role["ROLE.BASIC"],
  },
});

export default mongoose.model<User>("user", userSchema);
