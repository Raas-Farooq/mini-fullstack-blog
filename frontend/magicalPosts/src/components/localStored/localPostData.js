import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import VITE_API_URL from '../../config.js';

const useLocalPostData = (post) => {
    const [localPost, setLocalPost] = useState(post || null);

    useEffect(() => {
        if(post){
            setLocalPost(post)
        }
        
    }, [post]);
    
       const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function UrlsToImages(urls=null,bodyText=null){
        Object.entries(urls).forEach(([placeholder,url]) => {
            const data_id = placeholder.match(/!\[image\]\((\d+)\)/)[1];
            const replacement=`<img src="${url}" alt="${placeholder}" data-id="${data_id}" />`;   
            bodyText = bodyText.replace(RegExp(escapeRegExp(placeholder), 'g'), replacement);
        })
      return bodyText;
    }

   

    useEffect(() => {
        if(localPost?.title){
            const imagePreview = `${VITE_API_URL}/uploads/${encodeURIComponent(post.titleImage)}`
            console.log("localTitleImage ", localPost.titleImage);
            savingDataLocally('title', localPost.title);
            savingDataLocally('titleImage', localPost.titleImage);
            savingDataLocally('titleImagePreview', imagePreview);
            savingDataLocally('postId', localPost._id);
            savingDataLocally('contentImagesUrls', localPost.contentImagesUrls);
            savingDataLocally('content', localPost.content);
            
        }
        if(localPost?.content){
            const mainContent=localPost.content[0].textContent;
           const transformedContent=UrlsToImages(localPost.contentImagesUrls, mainContent);
            console.log("transform content: ", transformedContent);
           savingDataLocally("quillContent", transformedContent);
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