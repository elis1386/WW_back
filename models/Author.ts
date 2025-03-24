import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

const Author = mongoose.model('Author', authorSchema);

export default Author;
