import 'dotenv/config';
import 'dotenv-expand/config';
import express from 'express';
import { onRequest } from "firebase-functions/v2/https";
import { router } from './routes';
import { routeNotFound } from './middlewares/routeNotFound';
import { loggingMiddleware } from './middlewares/logging';
import { errorLoggingMiddleware } from './middlewares/error';
import { connectMongoDB } from './config/mongoose';
import cors from 'cors';

const app = express();
// app.get('/', (req, res) => {
//     res.send("Hello World");
// });

connectMongoDB();

// Body parser middleware for application/json
app.use(express.json());


app.use(cors());
app.use(loggingMiddleware);
// So we can also do /api/v1/ or /api/v2/ etc.
app.use('/api/v1/', router);
app.use(errorLoggingMiddleware);
app.use(routeNotFound);

export default app;
exports.api = onRequest(app)
