import morgan from 'morgan';

export const loggingMiddleware = morgan(':date :method :url :status ');
