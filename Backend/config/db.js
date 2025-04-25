
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const databaseJoined = () => {

   const connect = mongoose.connect(process.env.MONGO_URI).then
    (() => console.log(" Database Connection Has Given You Success. Alhamdulila!"))
    .catch(err => console.log("Err while connecting to MONGO ", err));
    return connect
}


export default databaseJoined

