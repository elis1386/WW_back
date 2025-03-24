import mongoose, { Schema } from 'mongoose';

const bookGenreSchema = new Schema({
  bookId: {
    type: Schema.ObjectId,
    ref: 'Book',
    required: true,
  },
  genreId: {
    type: Schema.ObjectId,
    ref: 'Genre',
    required: true,
  },
});

// Compound index to ensure that book-genre pairs are unique.
bookGenreSchema.index({ bookId: 1, genreId: 1 }, { unique: true });

const BookGenre = mongoose.model('BookGenre', bookGenreSchema);

export default BookGenre;
