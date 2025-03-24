import mongoose, { Schema } from 'mongoose';

const bookAuthorSchema = new Schema({
  bookId: {
    type: Schema.ObjectId,
    ref: 'Book',
    required: true,
  },
  authorId: {
    type: Schema.ObjectId,
    ref: 'Author',
    required: true,
  },
});

// Compound index to ensure that author-book pairs are unique.
bookAuthorSchema.index({ bookId: 1, authorId: 1 }, { unique: true });

const BookAuthor = mongoose.model('BookAuthor', bookAuthorSchema);

export default BookAuthor;
