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
    // const [titleImagePreview, setTitleImagePreview] = useState('');
    const [titleImageChanges, setTitleImageChanged] =useState(false);
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
                console.log("local Quill Content: ", localQuillContent);
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
                    const updatedContent = UrlsToImages(myPost.contentImagesUrls, bodyText);
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
                        console.log("response.data.url: ", response.data.url);
                        // const imageAlt = `![image](${new Date().getTime().toString()})`
                        // const myContentImage =  `<img src="${response.data.url}" alt="${imageAlt}" />`;
                        // console.log("myContentImage: ", myContentImage);
                        quill.setSelection(range);
                        quill.insertEmbed(range.index, 'image', response.data.url, 'user');
                        quill.setSelection(range.index + 1);
                        
                       resolve(response.data.url);
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
        console.log("image : ", image);
        ImageReader(image);
        setTitleImageChanged(true);
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
          setPostData(prev => ({
              ...prev,
              content: [{textContent: newContent}]
          }));
          localStorage.setItem('quillContent', JSON.stringify(newContent));
          setQuillContent(newContent);
      }, []);

      function handleSubmit(e){
        e.preventDefault();
        const imagePreview = JSON.parse(localStorage.getItem('titleImagePreview'));
        const titleImage = JSON.parse(localStorage.getItem('titleImage'));
        console.log("submit Clicked postData ", postData, "image Previe: ", imagePreview);
        const quillContent = JSON.parse(localStorage.getItem('quillContent'));
        const parser = new DOMParser();
        const doc = parser.parseFromString(quillContent, 'text/html');
        const images = doc.querySelectorAll('img');
        let newContentImagesUrls={};
        images.forEach(image => {
            // console.log("foreach : ", image.src ,"alt", image.alt);
            if(!image.alt){
                const newPlaceholder = '![image]' + `(${new Date().getTime().toString()})`;
                newContentImagesUrls[newPlaceholder] = image.src;
            }
            else{
                newContentImagesUrls[image.alt] = image.src;
            }

            console.log("newContentImagesUrls: ", newContentImagesUrls);
            setUpdatedImagesUrls(newContentImagesUrls);
            localStorage.setItem('contentImagesUrls', JSON.stringify(newContentImagesUrls));
        })

        if(!imagePreview.startsWith('http') || imagePreview.startsWith('data:image')){
             const newImageFile = base64ToFile(imagePreview, titleImage.name);
            console.log("newImagePreview: ", newImageFile);
        }
      }
    return (
        <div className="prose prose-lg max-w-full relative space-y-4">
            {/* console.log("How simple DOM: ",updatedImagesUrls); */}
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
