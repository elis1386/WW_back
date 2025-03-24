import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export type MongoHelper = {
  closeDatabase: () => Promise<void>;
  clearDatabase: () => Promise<void>;
};

// Mock the actual mongoose.connect from the app so it doesn't complain about calling it multiple times
jest.mock('../config/mongoose', () => {
  return {
    connectMongoDB: jest.fn(),
  };
});

async function connect() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);

  return {
    closeDatabase: async () => {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongod.stop();
    },
    clearDatabase: async () => {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        const collection = collections[key];
        await mongoose.connection.dropCollection(collection.collectionName);
      }
    },
  };
}

export default connect;
