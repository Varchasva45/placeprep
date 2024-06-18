import mongoose, { Number, Schema, model } from "mongoose";

interface otp extends Document {
  otp: Number;
  userId: mongoose.Schema.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<otp>(
  {
    otp: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: Date.now() + 1 * 60 * 1000,
    },
  },
  { timestamps: true },
);

const Otp = model<otp>("Otp", otpSchema);
export default Otp;
