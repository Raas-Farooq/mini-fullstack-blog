import mongoose, { mongo } from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        minlength:1,
        required:[true, "username is Required"]
    },
    email:{
        type:String,
        unique:true,
        required:[true, 'Email is Required'],
        validate:{
            validator:(value) => {
                return isEmail(value)
            },
            message:props => `${props.value} is not a valid email address`
        }
    },
    password:{
        type:String,
        required:[true, 'Password is Required']
    },
   
}, {
    timestamps:true
})


const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, "title is Required"],
        maxlength:70
    },
    titleImage:{
        type:String,
        required:[true, 'TitleImage is Required']
    },
    content:{
        type:[{}],
        minlength:10,
        required:[true, 'content is Required']
    },
    contentImagesUrls:{
        type:Object
    }
},  {
    timestamps:true
})

const userModel = mongoose.model('User', userSchema);
const postModel = mongoose.model('Post', postSchema);

export {userModel, postModel}


