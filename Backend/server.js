import mongoose from "mongoose";
import express from 'express';
import databaseJoined from './config/db.js'
import router from './routes/routes.js';
import errorLogger from './middleware/errorLogger.js';
import logger from "./middleware/logger.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from "path";


const port = 3700;
const app = express();
const myOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5172'
]
const origins = {
    origin:myOrigins
}
app.use(cors(origins));
app.use(express.json());
databaseJoined();
app.use(logger);
app.use(cookieParser());
app.use(errorLogger);
const __dirname=path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
// app.use('/uploads', express.static('/home/raas/Programming/ProFull-StackDev/Blog App/Backend/uploads'))
app.use('/blog', router);
app.listen(port, function() {
    console.log("PORT Is Running On: ", port)
})