import { useCallback, useEffect, useRef, useState } from "react";
import { Form, useLocation, useParams } from "react-router-dom";
import VITE_API_URL from '../../config.js';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import './edit.css';
import axios from 'axios';

const EditPost = () => {
    const location = useLocation();
    const {id} = useParams();
    const [post, setPost]= useState(location.state?.post || null);

    const quillRef=useRef();
    const [loadingPost, setLoadingPost] = useState(null);
    const [updatingPost, setUpdatingPost] = useState(false);
    // const [titleImagePreview, setTitleImagePreview] = useState('');
    const [titleImageChanges, setTitleImageChanged] =useState(false);
    const [dirtyFields, setDirtyFields] = useState({});
    const [newContent, setNewContent] = useState([{}]);
    const [cloudinaryUpload, setCloudinaryUpload] = useState();
    const [updatedImagesUrls, setUpdatedImagesUrls] = useState({});
    const [quillContent, setQuillContent] = useState([]);
    const [postData, setPostData] = useState({
        title:'',
        titleImage:null,
        content:[{}],
        titleImagePreview:'',
        contentImagesUrls:{}
    })
    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function UrlsToImages(urls,bodyText){
        Object.entries(urls).forEach(([placeholder,url]) => {
            const data_id = placeholder.match(/!\[image\]\((\d+)\)/)[1];
            const replacement=`<img src="${url}" alt="${placeholder}" data-id="${data_id}" />`;   
            bodyText = bodyText.replace(RegExp(escapeRegExp(placeholder), 'g'), replacement);
            return bodyText;
        })
    }
     function base64ToFile(base64, filename, mimeType) {
        const arr = base64.split(',');
        const mime = mimeType || arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    useEffect(() => {
        console.log("id from useParams inside EditPost:", id);
        const localTitleImage= JSON.parse(localStorage.getItem('titleImage'));
        const localTitle= JSON.parse(localStorage.getItem('title'));
        const localTextContent= JSON.parse(localStorage.getItem('content'));
        const localQuillContent= JSON.parse(localStorage.getItem('quillContent'));
        const localImagePreview= JSON.parse(localStorage.getItem('titleImagePreview'));
        const contentImagesUrls = JSON.parse(localStorage.getItem('contentImagesUrls'));
        // if(!localImagePreview.startsWith('http')){
           
        // }
        if(localTitle || localTextContent || localTitleImage || localQuillContent || localImagePreview){
            setPostData(prev => {return {
                ...prev,
                title:localTitle || '',
                content:localTextContent || [{}],
                titleImage:localTitleImage || '',
                titleImagePreview:localImagePreview,
                contentImagesUrls:contentImagesUrls || {}
            }})
            if(localQuillContent){
                setQuillContent(localQuillContent);
            }
            // const bodyText= localTextContent[0].textContent;
            // const updatedContent = UrlsToImages(contentImagesUrls, bodyText);
            
            // const quill = quillRef.current.getEditor();
            // console.log("updatedcontent: ", updatedContent)
            // quill.root.innerHTML = updatedContent;
            // setQuillContent(updatedContent);
        }
       else{
        async function fetchPost(){
            setLoadingPost(true);
            try{
                const response = await axios.get(`${VITE_API_URL}/blog/getPost/${id}`);

                if(response.data.success){
                    
                    setPost(response.data.blog);
                    const myPost = response.data.blog;
                    let bodyText = myPost.content[0].textContent;
                    let updatedContent;
                    if(myPost.contentImagesUrls) {updatedContent = UrlsToImages(myPost.contentImagesUrls, bodyText)};
                    const quill = quillRef.current.getEditor();      
                    quill.root.innerHTML = updatedContent;
                    setQuillContent(updatedContent);
                    setPostData(prev => ({
                        ...prev,
                        title:myPost?.title || '',
                        content:myPost?.content[0].textContent || [{}],
                        contentImagesUrls:myPost.contentImagesUrls || {},
                        titleImagePreview:`${VITE_API_URL}/uploads/${encodeURIComponent(myPost?.titleImage)}` || '',
                        titleImage:myPost?.titleImage || ''
                    }))
                }
            }catch(err){
                console.error(' err while fetching post inside Edit Component ', err);
            }
            finally{
                setLoadingPost(false);
            }
        }
        fetchPost();
       }
    },[post])


    useEffect(() => {
       console.log("updateImagesUrls ", updatedImagesUrls);
    },[updatedImagesUrls])


    function handleTitleChange(e){
        const newTitle = e.target.value;
        setDirtyFields(prev => ({
            ...prev,
            title:true
        }))
        setPostData(prev => ({
           ...prev,
           title:newTitle 
        }))
        localStorage.setItem('title', JSON.stringify(newTitle));
    }

      const quillImageHandling = useCallback(() => {
        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();
            input.onchange = async() => {
            const file = input.files[0];
            if(!file){
                resolve(null);
                return;
                
            }
            const quill = quillRef.current?.getEditor();
            const range = quill.getSelection();
            const content = quill.getContents()
            const uploadCloudinary = async(file) => {
                try{
                    const formData = new FormData();
                    formData.append('contentImage', file);
                    setCloudinaryUpload(true);
                    const response = await axios.post(`${VITE_API_URL}/blog/uploadContentImage`,formData, {
                        headers:
                        {
                            "Content-Type":"multipart/form-data"
                        }
                    });
                    if(response.data.success){
                        const altText = `![image](${Date.now()})`;
                        quill.setSelection(range);
                        quill.insertEmbed(range.index, 'image', response.data.url, 'user');
                        quill.formatText(range.index, 1, {
                            alt:altText
                        })
                        quill.setSelection(range.index + 1);
                        resolve(response.data.url);
                        setDirtyFields(prev => ({
                            ...prev,
                            contentImagesUrls:true
                        }))
                    }else{
                        resolve(null)
                    }
                }
                catch(err){
                    console.log('receive frontEnd error while uploading on cloudinary', err);
                    resolve(null);
                }finally{
                    setCloudinaryUpload(false);
                }
            }

            uploadCloudinary(file)
            }
        })
      },[]) 


      const handleImageChange = (e) => {
        const image = e.target.files[0];
        ImageReader(image);
        setTitleImageChanged(true);
        setDirtyFields(prev => ({
            ...prev,
            titleImage:true
        }))
      }
      const ImageReader = (image) =>{
        const file_reader = new FileReader;
        file_reader.onload = (event) => {
            const base64Image= event.target.result;
            setPostData(prev => ({
                ...prev,
                titleImage:image,
                titleImagePreview:base64Image
            }))
            const newImage = {
                name:image.name,
                size:image.size,
                type:image.type,
                date:image.lastModifiedDate
            }
            localStorage.setItem('titleImage', JSON.stringify(newImage));
            localStorage.setItem('titleImagePreview', JSON.stringify(base64Image))
        }
        file_reader.readAsDataURL(image);
      }


      const handleContentChange = useCallback((newContent) => {
          localStorage.setItem('quillContent', JSON.stringify(newContent));
          setDirtyFields(prev => ({
            ...prev,
            content:true
        }))
          setQuillContent(newContent);
      }, []);

      function extractTextWithLineBreaks(element) {
        let result = "";

            element.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    result += node.textContent;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const tag = node.tagName.toLowerCase();

                    if (['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
                        result += extractTextWithLineBreaks(node).trim() + "\n";
                    } else if (tag === 'br') {
                        result += "\n";
                    } else {
                        result += extractTextWithLineBreaks(node);
                    }
                }
                });
                return result.trim();
        }


      async function handleSubmit(e){
  
        e.preventDefault();
        const imagePreview = JSON.parse(localStorage.getItem('titleImagePreview'));
        const titleImage = JSON.parse(localStorage.getItem('titleImage'));
        const quillContent = JSON.parse(localStorage.getItem('quillContent'));

        // defining the Parser using DOMParser
        const parser = new DOMParser();
        // converting the text (quillContent which contains tags 'p','h2') to html Doc 
        const doc = parser.parseFromString(quillContent, 'text/html');
        const quill = quillRef.current?.getEditor();
        const images = doc.querySelectorAll('img');
        let newContentImagesUrls={};

      console.log("ID inside submit: ",id);
        images.forEach(image => {
            const placeholder = image.alt || `![image](${Date.now()})`;
            newContentImagesUrls[placeholder]=image.src;
            image.alt=placeholder;
            image.replaceWith(placeholder);
        })
        // removing and cleaning the html tags like 'div,p, h2 etc'
        
        const removedTags = extractTextWithLineBreaks(doc.body).trim();

        setPostData((prev) => ({
            ...prev,
            content:[{textContent:removedTags}]
        }))
        const formData = new FormData();  
        formData.append('contentImagesUrls', JSON.stringify(newContentImagesUrls));
        const myContent = JSON.parse(localStorage.getItem('content'));
         const originalContent = removeSpaces(myContent[0].textContent);
         function removeSpaces(content){
            return content.replace(/\s+/g, " ").trim();
         }
        if(originalContent !== removedTags[0].textContent){
            alert('Not equal')
        }else{
            console.log("texts are same")
        }
        formData.append('content', removedTags);
        formData.append('title', postData.title);
        setUpdatedImagesUrls(newContentImagesUrls);
        localStorage.setItem('contentImagesUrls', JSON.stringify(newContentImagesUrls));
        if(imagePreview && (imagePreview.startsWith('data:image') || !imagePreview.startsWith('http'))){
            const newImageFile = base64ToFile(imagePreview, titleImage.name);
            formData.append('titleImage', newImageFile);
        }else{
            formData.append('titleImage', imagePreview);
        }
        formData.entries((key, value) => {
            console.log("before SUBMISSION key", key, "Value: ", value);
        })
        try{
            setUpdatingPost(true);
            const response = await axios.put(`${VITE_API_URL}/blog/updateBlog/${id}`, formData,
                {
                    headers:{
                        "Content-Type":"multipart/form-data"
                    }
                }
            );
            console.log("response ", response);
        }catch(err){
            console.log("got error while updating the Post ", err);
        }
        finally{
            setUpdatingPost(false)
        }
        
      }
    return (
        <div className="prose prose-lg max-w-full relative space-y-4">
            {updatingPost && <div className="fixed inset-0 bg-black opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white text-black flex justify-center items-center text-2xl shadow-lg rounded-lg">
                        <h1>Updating Post</h1>
                    </div>
                </div>}
            <div className="text-left">
                <label className="font-bold"> Change Your Title </label>
                { post?.title && <input 
                type="text" name="title" 
                value={postData.title} 
                onChange={handleTitleChange} 
                className="border border-gray-600 p-2" /> }
            </div>

            <div className="mb-2">
                {postData?.titleImagePreview && <img src={postData.titleImagePreview} alt="TitleImage" className="max-w-md"/>}
            </div>
            <div className="space-y-3 mb-3 w-full max-h-xl text-left">
                <label className="bg-green-500 rounded-lg cursor-pointer transition-transform hover:bg-green-600 p-2"> 
                    <input type="file" accept="image/*"  onChange={handleImageChange} className="hidden" />       
                    change TitleImage
                </label>
            </div>
            <h3 className="font-bold text-left mt-2">Body Content</h3>
            {cloudinaryUpload && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center align-center">
                <h2 className="text-white text-2xl">UPLOADING TO CLOUDINARY...</h2>
            </div>
            )}
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={quillContent}
                onChange={handleContentChange}
                className="space-y-2"
                modules={{
                    toolbar:
                    {
                       container: [
                            [{ header: '1'}, {header:'2'}],
                            ['bold', 'italic', 'underline'],
                            ['image', 'code-block'],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            ['clean']
                       ],
                       handlers:{
                        image: quillImageHandling
                       }
                    }
                }}

            />
            <footer>
                <button onClick={handleSubmit} className="bg-blue-400 border border-blue-500 rounded-lg shadow-lg hover:bg-blue-600">saveChanges</button>
            </footer>
            
        </div>
    )
}

export default EditPost
