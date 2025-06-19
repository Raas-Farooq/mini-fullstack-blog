import { validationResult } from "express-validator";
import { postModel, userModel } from "../Model/model.js"
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { strict } from "assert";
// import {v2 as cloudinary} from 'cloudinary';
import path from "path";


dotenv.config()

const registerUser = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:"VAlidation error got",
            errors:errors.array()    
        })
    }
    try{
        
        const {username, email, password} = req.body;
        console.log("username", username, "email: ", email, "password ", password);
        const ifExist = await userModel.findOne({email});
        if(ifExist) return res.status(400).json('User Already Exists');
        const salt = parseInt(process.env.SALT_ROUNDS, 10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const registerUser = new userModel({username,email,password:hashedPassword});
        await registerUser.save();
        // const hashedPassword = bcrypt(hash, userData.password, 10);
        return res.status(201).json({
            success:true,
            message:"user Added successfully",
            newUser:registerUser
        })
    }catch(err){
        next(err)
    }
}
const loginUser = async(req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:"invalid Login Data",
            errors: errors.array()
        })
    }
    try{
        const {email, password} = req.body;
        const userExist = await userModel.findOne({email});
        if(!userExist) return res.status(404).json({success:false,message:"User doesn't Exists"});
        const compare = await bcrypt.compare(password, userExist.password);
        if(!compare) return res.status(400).json({success:false,message:"Password didn't Match"});

        const token = jwt.sign(
            {userId:userExist._id, email:userExist.email},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        )

        res.cookie('token', token,
            {
                httpOnly:true,
                secure:process.env.NODE_ENV === 'production',
                sameSite:strict,
                maxAge:3600000
            }
        )
        return res.status(200).json({
            success:true,
            message:"Doesn't we always have present",
            token,
            user:userExist
        })
        
    }catch(err){
        next(err)
    }
}


    const accessPost = async (req,res) => {
        console.log("accessPost has been Strengthened")
        const id = req.params.id;
        try{
            console.log("id received from params: ", id);
            const blog = await postModel.findOne({_id:id});
            if(!blog){
                return res.status(404).json({
                    success:false,
                    message:"Blog not found"
                })
            }

              
            return res.status(200).json({
                success:true,
                message:'Successfully accessed the blog',
                blog
            })
        }catch(err){
              
            return res.status(500).json({
                success:false,
                message:'server error while accessing the blog',
                err:err.message
            })
        }

    }


const createBlog = async(req,res,next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:'validation error occurred',
            errors:errors.array()
        })
    }

    try{
        const {title,content,contentImagesUrls} = req.body;
     
        const imagePath= req.file? req.file.path : null;
        console.log("req.files: ", req.file);
        if(!req.file){
            return res.status(404).json({
                success:false,
                message:"Err while accessing image file"
            })
        }
        // const imagesOfContent = req.files['contentImages']? req.files['contentImages'].map(img => img.path): []
        const parsedImagesUrls = JSON.parse(contentImagesUrls);
        const parsedContent = JSON.parse(content);
        console.log("imagePath: ", imagePath);
        const basePath = path.basename(imagePath);
        const newPost= new postModel({title, titleImage: basePath, content:parsedContent, contentImagesUrls:parsedImagesUrls });

        const postAdded = await newPost.save();

        if(!postAdded){
            return res.status(403).json({
                success:false,
                message:"Post not Created",
                err: err.message
            })
        }
        // console.log()
        // console.log("BACKEND contentImagesUrls", contentImagesUrls, "ContentImages: ", contentImages, "Title: ", title, "Content: ", content);
        
        // const newPost = new postModel({title, content, titleImage:image});
        // await newPost.save();
        return res.status(201).json(
            {
                success:true,
                message:"Have a Look on This blog",
                Post:newPost
            }
        )
    }catch(err){
        next(err)
    }
}

const allBlogs = async(req,res) => {
    
    try{
        const blogs = await postModel.find({});
        // const deleteAll = await postModel.deleteMany({})
        if(!blogs.length){
            return res.status(404).json({
                success:false,
                message:"Blogs Not found",

            })
        }

        return res.status(200).json({
            success:true,
            message:"Successfully deleted the blogs",
            blogs
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"server error while loading the blogs",
            error:err.message
        }
        )
    }
}

const updateBlog = async(req,res) => {

    try{
        const {id} = req.params;
        const {title, content, contentImagesUrls} = req.body;
        let contentImages = [];
        try{
            contentImages = JSON.parse(contentImagesUrls);
        }catch(err){
            contentImages = []
        }
        // or 
        // let contentImagesUrls = [];
        // try {
        //     contentImagesUrls = JSON.parse(req.body.contentImagesUrls);
        // } catch (e) {
        //     contentImagesUrls = [];
        // }
        console.log("Id after params: ", id, "Req.body: ",req.body);
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                message:"Got Validation Errors", 
                erros: errors.array()
            })
        }
        const updatedData = req.body;
        const image = req.file? req.file.path  : '';
        console.log("titleIMage: ", titleImage)
        // console.log("req body data; IMage",  "contentImageUrls: ", JSON.parse(contentImagesUrls));
        const blog = await postModel.findOne({_id: id});
        if(!blog){
            return res.status(404).json({
                success:false,
                message:"Blog Not found"

            })
        }

        const updatePost = await postModel.updateOne(
            {_id:id},
            {$set:{updatedData}},
            {new:true}  
        )
        // let newTitle = "";
        // let newImageLink = "";
        // let newContent  = [{textContent:''}];
        // let newContentImagesUrls={};
        // if(updatedData.title) {
        //     newTitle=updatePost.title
        // }
        //  if(updatedData.titleImage) {
        //     newImageLink=updatePost.title
        // }
        // //  if(updatePost.content) {
        // //     const newContent=updatePost.title
        // // }
        //  if(updatedData.contentImagesUrls) {
        //     newContentImagesUrls=updatePost.title
        // }
        return res.status(200).json({
            success:true,
            message:"Blog updated Successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Server error while updating Post",
            error:err.message
        })
    }
}
const allUsers = async(req,res) => {
    try{
        const findUsers = await userModel.find({});

        if(!findUsers.length) return res.status(404).json("No User found");
        console.log("users found: ", findUsers);
        return res.status(200).json({
            success:true,
            message:"Users Accessed Successfully",
            users:findUsers
        })
    }
    catch(err){
        next(err)
    }
}

export {registerUser, allUsers, loginUser, createBlog,allBlogs, accessPost, updateBlog};


