import { z } from 'zod';
import { BookDtoSchema, BookFiltersSchema } from '../schemas/book';
import { PaginationType } from './pagination';

//
//   I know it's a holywar theme, but at least for generic types like Book I prefer using Type suffix.
//   Here's the thing: you can have a model named Book. You can have a React component named Book. In a library app you can have pretty much anything named Book.
//   And chances are, you'll have to type it and inevitably experience a name clashing.
//
//   I want my LSP to be able to understand I'm referring to the type right away, so I wouldn't have to Tab through all of the suggestions it has to offer.
//

export type BookDto = z.infer<typeof BookDtoSchema>;
export type BookType = z.mergeTypes<BookDto, { id: string }>;

export type BookFilters = z.infer<typeof BookFiltersSchema>;
export type FindAllBooksOptions = z.mergeTypes<PaginationType, BookFilters>;
