import mongoose from "mongoose";

function getDb(databaseName: string): mongoose.Connection {
  const db = mongoose.connection.useDb(databaseName);
  return db;
}

export default getDb;
