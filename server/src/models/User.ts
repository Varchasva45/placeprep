import mongoose, { Document, Model, Schema } from "mongoose";

interface User extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
}

const userSchema = new Schema<User>({
    name: {
        type: String,
        // required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String
        // required: true
        // add validation for role
    }
});

const userModel = mongoose.connection.model<User>("User", userSchema);
export default userModel;