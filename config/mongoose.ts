import mongoose from 'mongoose';
const { DB_URL } = process.env;

// We decided not to catch the error here, because we want the server to crash if it can't connect to the database.
export const connectMongoDB = () =>
  console.log(DB_URL);
  mongoose.connect(DB_URL as string).then(() => console.log('Successfully connected to MongoDB.'));