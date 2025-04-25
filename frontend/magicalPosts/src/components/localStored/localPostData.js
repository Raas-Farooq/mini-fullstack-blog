import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";


const useLocalPostData = (post) => {
    const [localPost, setLocalPost] = useState(post || null);

    useEffect(() => {
        if(post){
            setLocalPost(post)
        }
        
    }, [post])

    useEffect(() => {
        if(localPost?.title){
            console.log("localPost; ", localPost)
            savingDataLocally('title', localPost.title);
            savingDataLocally('titleImage', localPost.titleImage);
            savingDataLocally('postId', localPost._id);
            savingDataLocally('contentImagesUrls', localPost.contentImagesUrls);
            savingDataLocally('content', localPost.content);
            
        }
    },[localPost])
    const savingDataLocally = (key, value) => {

        try{
            if(!value || value === 'undefined'){
                console.error('value is undefined or empty');
            }
            localStorage.setItem(key, JSON.stringify(value));
        }catch(err){
            console.error(`Error while saving key ${key}`)
        }
    }
    const safeParsing = (data) => {
        try{
            const storedValue = localStorage.getItem(data);
            if(!storedValue || storedValue === 'undefined'){
                return ''
            }
            return JSON.parse(storedValue)
         }catch(err){
            console.error("this is the err: ", err);
            return ''
        }  
    }




}

export default useLocalPostData