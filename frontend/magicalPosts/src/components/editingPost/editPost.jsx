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
        const titleImage = `<img style="width:100%; max-width:100px" src="${VITE_API_URL}/uploads/${post.titleImage}" alt="TitleImage" />`;

        bodyText = title + "<br/>" + titleImage + "<br/>" + `<article> ${bodyText} </article>`;
        // const updatedText = title+titleImage + bodyText;
        console.log("bodyText: after adding title titleImage", bodyText);
        setQuillContent(bodyText)
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
            console.log("post data inside useEffect ",postData);
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
    // const quillImageHandling = useCallback(() => {
    //     return new Promise((resolve) => {
    //       const input = document.createElement('input');
    //       input.setAttribute('type', 'file');
    //       input.setAttribute('accept', 'image/*');
    //       input.click();
      
    //       input.onchange = async () => {
    //         const file = input.files[0];
    //         console.log("file: ", file);
    //         const formData = new FormData();

    //         formData.append('contentImage',  file);
    //         const quill = quillRef.current?.getEditor();
    //         const range = quill.getSelection();
    //         quill.insertText(range.index, 'GreatEST FIGHT');
    //         console.log("current cursor: ", quill.getSelection);
    //         if (!file) return;
      
    //         try {
    //           // Here you would typically upload the file to your server
    //           // For now, we'll use a local object URL as placeholder
    //           const imageUrl = URL.createObjectURL(file);
    //           resolve(imageUrl);
    //         } catch (error) {
    //           console.error('Image upload error:', error);
    //           resolve(null);
    //         }
    //       };
    //     });
    //   },[]);
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
            
            const uploadCloudinary = async(file) => {
                try{
                    const formData = new FormData();
                    formData.append('contentImage', file);
                    formData.forEach((value, key )=> {
                        console.log("key: ", key ,": ", value)
                    })
                    console.log(`file ${file} `);
                    const response = await axios.post(`${VITE_API_URL}/blog/uploadContentImage`,formData, {
                        headers:
                        {
                            "Content-Type":"multipart/form-data"
                        }
                    });
                    if(response.data.success){
                        const quill = quillRef.current?.getEditor();
                        const range = quill.getSelection();
                        const [block] = quill.getLine(range.index);
                        if (block && block.domNode.tagName === 'H2') {
                            alert('Cannot insert images inside the title area');
                            resolve(null);
                            return;
                        }
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
            {/* {console.log("quillContent: DOm", quillContent)} */}
            {/* {loadingPost && <h1> Post is being Loading..</h1>} */}
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
