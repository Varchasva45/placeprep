import { ObjectId } from "mongoose";

interface userPayload {
  id: ObjectId;
  email: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: user;
  }
}
