import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import VITE_API_URL from '../components/../config';
import ReactQuill from "react-quill";
// import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import {MdDelete, MdEdit} from "react-icons/md"
import useLocalPostData from "./localStored/localPostData";

function DisplayPost(){
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const [processedContent, setProcessedContent] = useState(null);
    const {id} = useParams(); 
    const navigateTo = useNavigate();
    useLocalPostData(post);
    useEffect(() => {
        console.log("id received : ", id);

        async function accessPost(){

            try{
                console.log("viteApi Url ", VITE_API_URL);
                const response= await axios.get(`${VITE_API_URL}/blog/accessPost/${id}`);
                console.log("response of the api: ", response);
                if(response.data.success){
                    const blog = response.data.blog;
                    const content = blog.content[0].textContent;
                    const paragraphs = content.split(/(!\[image\]\([^)]*\))/g);
                        const processedContent = paragraphs.map((paragraph,ind) => {  
                            if(paragraph.startsWith("![image]")){

                                return (
                                    <img
                                    type={'image'}
                                    key={`img-${ind}`}
                                    className="w-44 h-44 rounded-lg "
                                    src={`${blog.contentImagesUrls[paragraph]}`}
                                    />
                                )
                            }else{
                                return (<p key={`p-${ind}`} className="text-left"> {paragraph} </p>)
                            }
                            
                        })
                        console.log("processed Content: ", processedContent);
                        setProcessedContent(processedContent);
                }
                setPost(response.data.blog);
            }
            catch(err){
                console.error(err)
            }
            finally{
                setLoading(false)
            }
        } 
        accessPost();
    },[id]);

    // useEffect(() => {
       
    //     useLocalPostData(post);
    // }, [])

    const handleEditPost = (e,id) => {
        e.stopPropagation();
        navigateTo(`/edit/${id}`, {state: { post : {...post} } });
    }
    return (
        <div>
            {/* {console.log("loading ", loading, "post DOM processedContent: ",processedContent)} */}
            {loading && <h1 className="text-center">Loading..</h1>}
            <div className={`${loading && 'hidden'}`}>
                <button onClick={(e) => handleEditPost(e, post._id)} className="shadow-2xl rounded-lg hover:bg-gray-200"> <MdEdit /> </button>
                <button className="border hover:bg-gray-200"> <MdDelete /> </button>
            </div>
            <h2 className="strong font-bold border-b border-green-500 shadow-full">{post?.title} </h2>
            <div className={`h-screen p-2 ${loading ? 'bg-transparent' : 'bg-gray-100'}  `}>
                    {post?.titleImage && 
                    <img src={`${VITE_API_URL}/uploads/${post?.titleImage}`} alt="titleImage" className="w-52 h-52"/> 
                    }
                    {!processedContent ? 'Loading Content' : 
                        (
                        <div className={`${loading ? 'bg-transparent' : 'bg-gray-100'} `}>
                            {processedContent}
                        </div>
                        )
                    }
            </div> 
     </div>
    )
}

export default DisplayPost


// questions

// const handleEditPost = (e,id) => {
//     e.stopPropagation();
//     navigateTo(`/edit/${id}`, {state: { post : {...post} } });
// }

// why doing this  {state: { post : {...post} } })