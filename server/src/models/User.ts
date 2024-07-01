import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  name?: string;
  username: string;
  email: string;
  password: string;
  imageUrl: string;
  githubAccount: string;
  linkedInAccount?: string;
  personalInformation: {
    summary: string;
    location: string;
    education: string;
    linkedInLink: string;
    githubLink: string;
  };
  profileStats: {
    views: number;
    respect: number;
    activeDays: { count: number; year: number }[];
    submissionCount: { count: number; year: number }[];
    programmingLanguages: { language: string; problemCount: number }[];
  };
  isSubscribed: boolean;
  role: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: function () {
      return !this.githubAccount;
    },
  },
  password: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
    default: null,
  },
  githubAccount: {
    type: String,
    unique: true,
    trim: true,
    required: function () {
      return !this.email;
    },
  },
  personalInformation: {
    type: {
      summary: { type: String, trim: true },
      location: { type: String, trim: true },
      education: { type: String, trim: true },
      linkedInLink: { type: String, trim: true },
      githubLink: { type: String, trim: true },
    },
    default: {
      summary: "",
      location: "",
      education: "",
      linkedInLink: "",
      githubLink: "",
    },
  },
  profileStats: {
    type: {
      views: { type: Number, default: 0 },
      respect: { type: Number, default: 0 },
      activeDays: [
        {
          count: { type: Number, default: 0 },
          year: { type: Number, default: new Date().getFullYear() },
        },
      ],
      submissionCount: [
        {
          count: { type: Number, default: 0 },
          year: { type: Number, default: new Date().getFullYear() },
        },
      ],
      programmingLanguages: [
        {
          language: { type: String },
          problemCount: { type: Number },
        },
      ],
    },
    default: {
      views: 0,
      respect: 0,
      activeDays: [{ count: 0, year: new Date().getFullYear() }],
      submissionCount: [{ count: 0, year: new Date().getFullYear() }],
      programmingLanguages: [],
    },
  },
  isSubscribed: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
    trim: true,
  },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
