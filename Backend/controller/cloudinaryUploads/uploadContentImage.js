import {v2 as cloudinary} from 'cloudinary';

const uploadContentImage = async(req,res) => {
    console.log("req file: ", req.file);
    const image = req.file.path;
    console.log("image inside backend uploadContent: ", image);
    cloudinary.config({
        cloud_name: 'dk9guj9vd',
        api_key: '679969866855214',
        api_secret:'KLFSinQdB0uj7hJJeEEl1NIoRyg'
    })
        try{
            const cloudImageResult = await cloudinary.uploader.upload(
                image,{
                    folder:'ContentImages'
                }
            ).catch(err => console.log("err while uploading on cloudinary: ", err))
        
            console.log("cloudImageResult ", cloudImageResult);

        console.log("Upload Image Has RuN!");
            res.status(200).json({success:true, message:"Image Successfully Uploaded", url:cloudImageResult.secure_url, public_id:cloudImageResult.public_id})
        }   
        catch(err){
            console.log("err while uploading on cloudinary: ", err)
        }
    }

export default uploadContentImage;
