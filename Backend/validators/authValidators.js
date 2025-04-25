import { body } from "express-validator";


const createBlogValidation = [
    body('title').notEmpty().isLength({max:70}).withMessage("Length of Title shoudn't increase 70"),
    body('content').notEmpty().isLength({min:10}).withMessage("Blog content Should be atleast 10 character long")
]
const registerValidation  = [
    body('username').isLength({min:3}).trim().escape().withMessage("Username should be atleast 3 characters"),
    body('email').isEmail().normalizeEmail().withMessage("Email should be in Valid format. exp example@gmail.com"),
    body('password').isLength({min:6}).trim()
    ]


const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage("email Must be in valid format"),
    body('password').trim().isLength({min:6})
    ]


export {registerValidation, loginValidation, createBlogValidation};

// body('username').isLength({min:3}).trim().escape(). what do you call these 'trim and escape as function or method can we pronounce them as trim-method and escape-method or trim-function and what about 'new Date().' is it method or function'