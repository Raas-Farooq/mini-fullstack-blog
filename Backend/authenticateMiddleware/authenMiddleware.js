import { cookie } from "express-validator";
import jwt from "jsonwebtoken";
import test from "node:test";


const authenMiddleware = (req,res, next) => {
   const token = res.cookies.token;

   if(!token) return res.status(401).json("Not Authorized")

   try{
      const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verifyToken;
      next()
   }
   catch(err){
      next(err);
   }
}

export default authenMiddleware