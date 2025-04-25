import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import VITE_API_URL from '../config';

const EditPost = () => {
    const location = useLocation();
    const {id} = useParams();
    const [post, setPost]= useState(location.state?.post || null);
    const [loadingPost, setLoadingPost] = useState(null);
    const [postContent, setPostContent] = useState(null);
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
       if(post){
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
    //     if(post.content){
    //         const content = post.content[0].textContent;
    //         setPostContent(content);
    //     }
    // },[])


    function handleTitleChange(e){
        console.log("handle Titchle chagne running ", e.target.value)
        const newTitle = e.target.value;
        setPostData(prev => ({
           ...prev,
           title:newTitle 
        }))
        localStorage.setItem('title', JSON.stringify(newTitle));
    }
    return (
        <div>
            {loadingPost && <h1> Post is being Loading..</h1>}
            {console.log("Post.PostDAta: ", postData)}
            {/* <h1> {post?.title} </h1> */}
            <form type="Post" className="text-left space-y-4">
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
                
            </form>
        </div>
    )
}

export default EditPost