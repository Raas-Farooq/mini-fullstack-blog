import express from 'express';
import { registerUser, allUsers, loginUser, createBlog, allBlogs, accessPost, updateBlog } from '../controller/controller.js';
import {body} from 'express-validator';
import { loginValidation, registerValidation, createBlogValidation } from '../validators/authValidators.js';
import { upload } from './uploads.js';
import uploadContentImage from '../controller/cloudinaryUploads/uploadContentImage.js';

const router = express.Router();

function validateEmail(email){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

router.post('/createBlog', upload.single('titleImage'), (req,res,next) => {
    console.log('Request inside route: ', req.body);
    console.log("req file inside route: ", req.file);
    next();
},
    createBlogValidation, createBlog);
router.put('/updateBlog/:id', upload.single('titleImage'), updateBlog);
router.post('/uploadContentImage', upload.single('contentImage'),uploadContentImage);
router.get('/accessPost/:id', accessPost);
router.post('/registerUser',registerValidation, registerUser);
router.post('/loginUser', loginValidation,loginUser);
router.get('/allBlogs', allBlogs);
router.get('/allUsers', allUsers);
export default router

