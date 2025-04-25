import React,{ useEffect, useState, useRef} from "react";
import {debounce, keyBy} from 'lodash';
import {FaSpinner, FaTimes} from 'react-icons/fa';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {CircleLoader} from 'react-spinners';
import { useNavigate } from "react-router-dom";

const customImage = ({src, alt}) => {
   return (
    <div>
        <img src={src} alt={alt} style={{width:'350px', height:'350px'}} />
        <button className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded">
            delete
        </button>
    </div>
   )

}
export default function NewBlog(){

    const [title, setTitle] = useState('');
    const [titleImg, setTitleImg] = useState('');
    const [previewTitleImage, setPreviewTitleImage] = useState('');
    const editableTextRef = useRef(null);
    const [content, setContent] = useState("");
    const [cursorPosition, setCursonPosition] = useState(0);
    const [contentImagesUrls, setContentImagesUrls] = useState({})
    // const [contentImageValue, setContentImageValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [imagePositions, setImagePositions] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {

        const titleStored = safeParsing('title');
        const textContent = safeParsing('textContent');
        const localPreviewImage = safeParsing('previewTitleImage');
        const contentImages = safeParsing('contentImagesUrls')
        
        console.log("titleStored: ",titleStored?.length, 'TextContentStored: ', textContent?.length, "contentImagesUrls ",contentImagesUrls);

        if(titleStored !== ''){
            setTitle(titleStored);
        }
        // if(titleImageStored){
        //     setTitleImg(titleImageStored);
        // }
        if(textContent !== ""){
            setContent(textContent);
        }
        if(localPreviewImage != ""){

            setPreviewTitleImage(localPreviewImage);
        }
        if(contentImages != ""){
            setContentImagesUrls(contentImages)
        }
    }, []);

   function safeParsing(key){
        const storedItem= localStorage.getItem(key);
        try{
            if(storedItem === 'undefined' || !storedItem){
                return ''
            }
            return JSON.parse(storedItem);
        }
        catch(err){
            console.error('Error while parsing localStorage data ', err);
            return ''
        }

   }

    useEffect(() => {
        saveContentImagesLocally('contentImagesUrls',  contentImagesUrls)
        
    },[contentImagesUrls])

    const saveContentImagesLocally =  debounce((name, value) => {
        localStoring(name, value)
    },500)


    const localStoring =  (name, value) => {
      
        localStorage.setItem(name, JSON.stringify(value));
        
        
    }

    function loadNewContent(){
        let transformedContent = content;
        Object.entries(contentImagesUrls).forEach(([placeholder,image]) => {
            transformedContent = transformedContent.replace(placeholder, `![image](${image})`);
        })
        return transformedContent 
    }
    
    
    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        localStoring('title', newTitle)
    }
    const handleTitleImage = (e) => {
        const image =  e.target.files[0];
        console.log("IMAGE FIle :", image);
        if(image){
            setTitleImg(image);
            localStoring('titleImg', image)
        }
        convertToBase64(image);

    }
    function convertToBase64(image){
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Image = event.target.result;
            setPreviewTitleImage(base64Image)
            localStoring('previewTitleImage', base64Image);
        }
        reader.readAsDataURL(image)
     }

     const getStoredTitleImage = async () => {
        const base64String = localStorage.getItem('previewTitleImage');
        console.log("base64 string: ", base64String);
        
        if (base64String) {
            try {
                // Parse the JSON string if it's stored as a JSON string
                const parsedString = JSON.parse(base64String);
                const dataUrl = parsedString; // Since you're storing it as a JSON string
                
                // Check if the data URL has the correct format
                if (!dataUrl || !dataUrl.includes('base64,')) {
                    console.error("Invalid data URL format");
                    return null;
                }
                
                // Extract the base64 part after "base64,"
                const base64Data = dataUrl.split('base64,')[1];
                
                // Decode Base64 to binary
                const byteCharacters = atob(base64Data);
                
                // Convert binary to byte array
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                
                // Create Uint8Array from bytes
                const byteArray = new Uint8Array(byteNumbers);
                
                // Determine the image type from the data URL
                let imageType = 'image/jpeg'; // Default
                if (dataUrl.includes('image/png')) {
                    imageType = 'image/png';
                } else if (dataUrl.includes('image/webp')) {
                    imageType = 'image/webp';
                }
                
                // Create Blob from byte array
                const blob = new Blob([byteArray], { type: imageType });
                
                // Create File from Blob
                const file = new File([blob], 'titleImage.jpg', { type: imageType });
                
                return file;
            } catch (err) {
                console.log("Error processing base64 image:", err);
                return null;
            }
        }
        return null;
    };

    const handleContentImages = async (e) => {
        setLoading(true);

        async function getImageUrl(formImage){
            
            try{
                const imageResponse = await axios.post('http://localhost:3700/blog/uploadContentImage', formImage,
                {
                    headers: {
                        "Content-Type":"multipart/form-data"
                    } 

                })

                return imageResponse.data.url
            }
            catch(err){
                console.log("got Error while posting: ", err);
                return null
            }
        }

        const imgFile = e.target.files[0];
        if(imgFile){
            console.log("contentImage as formImg befre appending ", imgFile)
            const formData = new FormData();
            formData.append('contentImage', imgFile);
        
            const imageUrl = await getImageUrl(formData);
            try{
                const contentText = editableTextRef.current.value;
                // console.log(" value of editableTextRef: ", contentText);
                const firstPart = contentText.slice(0, cursorPosition);
                const lastPart = contentText.slice(cursorPosition);
                const placeholder = `![image](${Date.now()})`;
                const newText = firstPart + placeholder + lastPart; 
                console.log("starting position: ", cursorPosition);
                console.log("Ending Position :", cursorPosition + placeholder.length);
                
                setImagePositions(prev => [
                    ...prev, 
                    {
                        placeholder,
                        start:cursorPosition,
                        end:cursorPosition+placeholder.length
                    }
                ])
                setContent(newText);
                localStoring('textContent', newText);
                setContentImagesUrls(prev => ({
                    ...prev,
                    [placeholder]:imageUrl
                    }))
                
                console.log("image Position: ", imagePositions);
                // localStoring('contentImagesUrls', contentImagesUrls)
                
            }catch(err){
                console.error("Failed to Upload Image ", err.message)
            }finally{
                setLoading(false)
            }      
        }

        
            
    }
    const handleTextContent = (e) => {

       
        const currentValue = e.target.value;
        const placeholders = Object.keys(contentImagesUrls);
        console.log("Object.keys placeholders: ", placeholders);
    
        const isPlaceholderModified = placeholders.some((placeholder) => {
            return !currentValue.includes(placeholder)
        })

        if(isPlaceholderModified){
            console.warn("Trying to remove placeholder");
            e.target.value = content;
            return;
        }
        localStoring('textContent', currentValue);
        setContent(currentValue);
    };
    

    const handleCursorPosition = () => {
        const position = editableTextRef.current.selectionStart;
        setCursonPosition(position);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData= new FormData(); 
        console.log("title: ", title);
        formData.append('title', title);
        console.log("formData after title appending ", formData)
        const textContent = [{textContent:content}]
        formData.append('content', JSON.stringify(textContent));

        try {
            if (titleImg) {
                console.log("Using provided title image");
                if (titleImg instanceof File) {
                    formData.append('titleImage', titleImg);
                }
            } else {
                console.log("Attempting to get stored title image");
                const file = await getStoredTitleImage();
                console.log("File received:", file);
                if (file) {
                    formData.append('titleImage', file);
                }
            }
        } catch (error) {
            console.error("Error processing title image:", error);
        }
        formData.append('contentImagesUrls', JSON.stringify(contentImagesUrls))

        try{
            setLoading(true);
            console.log("formData before sending", formData);
            const response = await axios.post(`http://localhost:3700/blog/createBlog`, 
                formData,
                {
                    headers:{
                        "Content-Type":"multipart/form-data"
                    }
                }
                )
                console.log("response after sending post Data: ", response);
                if(response.data.success){
                    alert("Blog Created Successfully")
                    navigate('/')
                }
        }catch(err){
             if(err?.response?.data || err?.response?.data?.error){
                console.log("got response error while posting: ", err.response.data)
             }
             if(err.request){
                console.log("Server responded with error");
             }
             if(err.message){
                console.log("error received while posting a new Blog ", err.message);
             }
        }finally{
            setLoading(false)
        }
    }
    function handleDeleteImage(src) {
        const foundPlaceholder = Object.keys(contentImagesUrls).find(placeholder => 
            contentImagesUrls[placeholder] === src
        )

        if(!foundPlaceholder){
            console.warn("Image not found for delete");
            return;
        }
        console.log("foundPlaceholder: ", foundPlaceholder);
        const updatedContent = content.replace(foundPlaceholder, "");
        setContent(updatedContent);
        localStoring('textContent', updatedContent);
        const newImagesUrls= {...contentImagesUrls};

        delete newImagesUrls[foundPlaceholder];
        setContentImagesUrls(newImagesUrls);  
    }
    return (
        <div className="w-screen">
            <h3 className="text-blue-600"> Didn't He Bless you in So many ways</h3>
            <h2> How many things did we learn from failure</h2>  
            {/* <button> <FaSpinner /></button> */}
            {loading &&
            <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg text-black p-8 flex items-center">

                    <FaSpinner className="animate-spin" /> Uploading..
                </div>
           </div>
            }
           <div className="bg-gray-500 p-4 text-left text-gray-800 w-4/5 flex gap-5">
                <form method="POST" onSubmit={handleSubmit} className="space-y-5 flex flex-col w-3/5">
                    <input 
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleTitleChange}
                    className="bg-blue-500 text-white"
                    />
                    <label className="text-left">Title Image</label>
                    <input
                    className="w-52"
                    aria-label="title-image"
                    type="file"
                    accept="image/*"
                    onChange={handleTitleImage}
                    />
                    {previewTitleImage &&  <img src={previewTitleImage} alt={titleImg?.name} className="w-44 h-auto" />}
                    <label> Content </label>
                    <div className="w-full h-80 relative bg-blue-500 focus:border-none">

                        <textarea
                            className="text-white h-72 w-full bg-blue-500"
                            onClick={handleCursorPosition}
                            onKeyUp={handleCursorPosition}
                            value={content}
                            onChange={(e) => handleTextContent(e)}
                            ref={editableTextRef}
                        />
                        
                        <label htmlFor="contentImg" className="p-2 absolute right-2 bottom-2 rounded-full text-blue bg-white shadow-lg hover:transition-all hover:duration-300 cursor-pointer">
                            <span>Add Image</span>
                            <input 
                            type="file"
                            accept="image/*"
                            onChange={handleContentImages}
                            className="hidden"
                            id="contentImg"
                            />
                        </label>
                    </div>
                    <button className="w-32 rounded:lg bg-blue-500 hover:bg-blue-500" onClick={handleSubmit}> New Blog</button>    
                </form>
                <div className="w-2/5">
                    <h2>Displaying Content Markdown</h2>
                    <div className="flex gap-3">
                        {content.length>1 && 
                        <ErrorBoundary>
                        <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({node, ...props}) => <p className="w-full" {...props} />,
                            img: ({ src, alt }) => (
                                <span className="relative">
                                    <img src={src} alt={alt} style={{ width: '350px', height: '350px' }} />
                                    <button
                                        className="absolue right-0 left-0 bg-red-500 text-white p-1 rounded"
                                        onClick={() => handleDeleteImage(src)}
                                        style={{zIndex:10}}
                                    >
                                        Delete
                                    </button>
                                </span>
                            ),
                        }}>
                            {loadNewContent() || " "} 
                        </ReactMarkdown>
                        </ErrorBoundary>
                        }  

                    </div>
                </div>     
            </div>   
       </div>
    )
}

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return <div>Something went wrong. Please try again.</div>;
      }
      return this.props.children;
    }
  }