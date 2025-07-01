import { useCallback, useEffect, useState } from "react"
import axios from 'axios';
import VITE_API_URL from '../components/../config.js';
import { useNavigate } from "react-router-dom";


const DisplayBlogs = () => {

    const [loading,setLoading] = useState(true);
    const [allBlogs, setAllBlogs] = useState([]);
    const navigateTo = useNavigate();

    const clearLocalStorage = useCallback(() => {
        localStorage.removeItem('title');
        localStorage.removeItem('titleImage');
        localStorage.removeItem('content');
        localStorage.removeItem('contentImagesUrls');
        localStorage.removeItem('postId');
        localStorage.removeItem('quillContent');
        localStorage.removeItem('titleImagePreview');
    }, [])
    
    useEffect(() => {
        // printPyramid(4)
        async function loadAllBlogs(){
            
            setLoading(true);
            try{
                const response = await axios.get(`${VITE_API_URL}/blog/allBlogs`);

                console.log("response: ", response);
                setAllBlogs(response.data.blogs)
            }catch(err){
                console.log("err while getting all blogs: ", err);
            }finally{
                setLoading(false);
            }
        }
        clearLocalStorage();
        loadAllBlogs();
    },[])
    function shortContent(data){
        if(typeof data !== 'string' || !data) return;
        const words = data.trim().split(/\s+/);
        console.log('words: ', words);
        const myShortData = words.slice(0,20).join(' ');
        console.log("myShortData ", myShortData);
        return myShortData;
    }
    const handlePostClick = (e, id) => {
        alert("post clicked ");
        navigateTo(`/post/${id}`);
    }
    if(loading) return <h2> Loding blogs..</h2>
    
    return (
       <>
            <div className="flex w-full flex-wrap gap-5 bg-pink-400 p-10 justify-center">
             
                {allBlogs?.map(blog => 
                    (
                        <div className="" key={blog._id}>
                            <div 
                            key={blog._id} 
                            onClick={(e) => handlePostClick(e, blog._id)}
                            className="w-80 cursor-pointer shadow-lg bg-white text-gray-800 rounded-lg transform hover:scale-105 transition-transform duration-300">
                                <h3 className="text-strong">{blog.title}</h3>
                                <span className="font-bold">Title Image</span>
                                <img src={`${VITE_API_URL}/uploads/${blog?.titleImage}`} alt={blog.title} className="w-44 h-auto" />
                                <h5 className="font-bold">Body</h5>
                                <p>{shortContent(blog.content[0].textContent) || shortContent(blog.content[0].textContent)}.. </p>
                            </div>
                        </div>
                    )
                )}
            </div>
       </>
    )
}

export default DisplayBlogs