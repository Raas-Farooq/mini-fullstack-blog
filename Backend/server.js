import mongoose from "mongoose";
import express from 'express';
import databaseJoined from './config/db.js'
import router from './routes/routes.js';
import errorLogger from './middleware/errorLogger.js';
import logger from "./middleware/logger.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';


const port = 3700;
const app = express();
app.use(cors());
app.use(express.json());
databaseJoined();
app.use(logger);
app.use(cookieParser());
app.use(errorLogger);
app.use('/uploads', express.static('/home/raas/Programming/Pro Full-Stack Dev /Blog App/Backend/uploads'))
app.use('/blog', router);
app.listen(port, function() {
    console.log("PORT Is Running On: ", port)
})