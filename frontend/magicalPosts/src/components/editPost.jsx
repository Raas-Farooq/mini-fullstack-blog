import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import VITE_API_URL from '../config';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const EditPost = () => {
    const location = useLocation();
    const {id} = useParams();
    const [post, setPost]= useState(location.state?.post || null);
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
            const replacement=`<img src="${url}" alt="${placeholder}" className="h-44 w-44" data-id="${data_id}" />`;
            
            bodyText = bodyText.replace(RegExp(escapeRegExp(placeholder), 'g'), replacement);
            console.log("bodyText inside entries; ", bodyText);
        })
        console.log("bodyText after Object.enties: ", bodyText);
        // console.log("bodyText: after replace", bodyText);
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
    //     if(quillContent){
    //         console.log("quill content: ", quillContent);
    //     }
    // },[quillContent])


    function handleTitleChange(e){
        console.log("handle Titchle chagne running ", e.target.value)
        const newTitle = e.target.value;
        setPostData(prev => ({
           ...prev,
           title:newTitle 
        }))
        localStorage.setItem('title', JSON.stringify(newTitle));
    }

    const handleContentChange = function(newContent){
        setQuillContent(newContent)
        setPostData(prev => ({
            ...prev,
            content:[{textContent:newContent}]
        }))
    }
    return (
        <div className="prose prose-lg max-w-full">
            {console.log("quillContent: DOm", quillContent)}
            {loadingPost && <h1> Post is being Loading..</h1>}
            <ReactQuill
                theme="snow"
                value={quillContent}
                onChange={handleContentChange}
                className="space-y-2"
                modules={{
                    toolbar:[
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        ['image', 'code-block'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['clean']
                    ]
                }}

            />
            
        </div>
    )
}

export default EditPost


{/* <form type="Post" className="text-left space-y-4">
                <label> Edit Your title  </label>
                <input type='text' name='title' value={postData.title} className="border border-gray-700 w-1/2" 
                onChange={handleTitleChange} />
                {post.titleImage && 
                <img src={`${VITE_API_URL}/uploads/${postData.titleImage}`} className="w-28 h-32"/>
                }
                <input type="file" name="image" accept="/*image" />
                <div>
                    <textarea cols={55} rows={18} className="border border-gray-700" value={postData.content} />
                </div>
                
            </form> */}