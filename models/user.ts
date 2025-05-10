import mongoose, {Schema, model, models} from "mongoose";
import { unique } from "next/dist/build/utils";

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true },
})

const User = models.User || model("User", UserSchema);

export default User;