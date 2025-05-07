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
    const [cloudinaryUpload, setCloudinaryUpload] = useState();
    const [quillContent, setQuillContent] = useState([]);
    const [postData, setPostData] = useState({
        title:'',
        titleImage:'',
        content:[{}],
        contentImagesUrls:{}
    })
    useEffect(() => {
        
        // const post = location.state?.post;
        console.log("post: Editing ", post, 'id ', id);
       if(!post){
        function fetchPost(){
            setLoadingPost(true);
            try{
                const response = axios.get(`${VITE_API_URL}/blog/getPost/${id}`);

                if(response.data.success){
                    
                    setPost(response.data.blog);
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
       const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
       if(post){
        let bodyText = post.content[0].textContent;
        // console.log("initial ", bodyText)
        Object.entries(post.contentImagesUrls).forEach(([placeholder,url]) => {
            console.log("placeholder: inside entry ", placeholder);
            const data_id = placeholder.match(/!\[image\]\((\d+)\)/)[1];
            const replacement=`<img src="${url}" alt="${placeholder}" data-id="${data_id}" />`;   
            bodyText = bodyText.replace(RegExp(escapeRegExp(placeholder), 'g'), replacement);
        })
        const title = `<h2 id="title" class="font-bold">${post.title}</h2>`;
        const titleImage = `<img data-role="title-image" src="${VITE_API_URL}/uploads/${post.titleImage}" alt="TitleImage" />`;
        const quill = quillRef.current.getEditor();
        const titleh2 = `
        <h2 id="title">${post?.title}</h2>
       `
       let titleImageHTML;
       if(post?.titleImage){
      titleImageHTML=`<img 
            src="${VITE_API_URL}/uploads/${post?.titleImage}" 
            data-role="title-image" 
            class="title-image" 
            contenteditable="false"
        />
        `
       }


        const html = titleh2 + titleImageHTML + bodyText;
        
        quill.root.innerHTML = html;
        // bodyText = title + `<article> ${bodyText} </article>`;
        // const updatedText = title+titleImage + bodyText;
        console.log("all HTML: after adding titleImage + bodyText", html);
        setQuillContent(html)
        setPostData(prev => ({
            ...prev,
            title:post?.title || '',
            content:post?.content[0].textContent || [{}],
            contentImagesUrls:post.contentImagesUrls || {},
            titleImage:post?.titleImage || ''
        }))

       }
    },[post])
    // useEffect(() => {
    //     const locallyQuillContent=JSON.parse(localStorage.getItem('quillContent'));
    //     if(locallyQuillContent){
    //         console.log("locallyQuillContent: ", locallyQuillContent);
    //     }
    // })
    useEffect(() => {
        if(postData){
            
            }
    },[postData])


    function handleTitleChange(e){
        console.log("handle Titchle chagne running ", e.target.value)
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
            console.log("file received: ", file)
            if(!file){
                resolve(null);
                return;
                
            }
            const quill = quillRef.current?.getEditor();
            const range = quill.getSelection();
            const [block] = quill.getLine(range.index);
            const isInTitle = block && block.domNode.tagName === 'H2';
            const content = quill.getContents()
            const hasTitleImage = content.ops.some(op => op.insert?.image?.attributes?.['data-role']==='title-image')
            const isNearTitleImage = quill.getText(range.index - 10, 20).includes('data-role="title-image"');
            console.log("is Near Title: ", isNearTitleImage, "hasTitleImage: ", hasTitleImage);
            if (isInTitle || hasTitleImage && range.index < 400) {
                alert('Cannot insert images in the title or title image area!');
                resolve(null);
                return;
            }
            const uploadCloudinary = async(file) => {
                try{
                    const formData = new FormData();
                    formData.append('contentImage', file);
                    formData.forEach((value, key )=> {
                        console.log("key: ", key ,": ", value)
                    })
                    setCloudinaryUpload(true);
                    const response = await axios.post(`${VITE_API_URL}/blog/uploadContentImage`,formData, {
                        headers:
                        {
                            "Content-Type":"multipart/form-data"
                        }
                    });
                    if(response.data.success){
                        const myContentImage = `</br> ` + `<img src="${response.data.url}" alt="contentImage" />` + `</br>`
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

    const handleContentChange = function(newContent){
        // console.log("new Content in Handle change ", newContent);
        const parsing = new DOMParser();

        const DOMDocument = parsing.parseFromString(newContent, "text/html");
        const titleRetrieved= DOMDocument.querySelector('h2');
        console.log("title retrieved: ", titleRetrieved);
        setQuillContent(newContent);
        localStorage.setItem('quillContent', JSON.stringify(newContent));
        setPostData(prev => ({
            ...prev,
            content:[{textContent:newContent}]
        }))
        console.log("data : after Change ",newContent );
    }
    return (
        <div className="prose prose-lg max-w-full">
            {console.log("post: DOm", post)}
            <button>        
                {post?.titleImage ? 'Change Title Image': 'Add Title Image' }
            </button>
            {/* {
                post?.titleImage && 
                <img 
                src={`${VITE_API_URL}/uploads/${post?.titleImage}`}
                alt='title-image'
                data-role="title-image"
                />
            } */}
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
            
        </div>
    )
}

export default EditPost
