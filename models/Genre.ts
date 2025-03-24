import mongoose from 'mongoose';

const GenreSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
});

const GenreModel = mongoose.model('Genre', GenreSchema);
export default GenreModel;
