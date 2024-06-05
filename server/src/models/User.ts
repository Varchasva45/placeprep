import mongoose, { Document, Model, Schema } from "mongoose";

interface User extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    githubAccount: string;
    isSubscribed: boolean;
}

const userSchema = new Schema<User>({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        default: "user",
        trim: true
    },
    githubAccount: {
        type: String,
        trim: true
    },
    isSubscribed: { 
        type: Boolean, 
        default: false 
    }
});

const userModel = mongoose.connection.model<User>("User", userSchema);
export default userModel;