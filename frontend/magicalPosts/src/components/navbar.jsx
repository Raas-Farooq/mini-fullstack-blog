import { act, useState } from "react";
import { FaBars, FaCommentsDollar, FaTimes } from "react-icons/fa";
import clsx from 'clsx';
import { useNavigate } from "react-router-dom";



export default function Navbar() {
    const [menuVisible, setMenuVisible] = useState(false);
    const navigate = useNavigate() 
    const handleNewBlogClick = () => {
        console.log("newBlog btn clicked");

        navigate('/newBlog')
        }

        const handleAboutUs = () => {
            function doubleZero(my_array){
                console.log("actual array ", my_array);
                let zeroCount = 0;
                my_array.forEach(num => {
                    if(num===0){
                        zeroCount++;
                    }
                })
                const actualLen = my_array.length;
                let readArr= actualLen - 1;
                let virtualLen = actualLen + zeroCount - 1;

                while(readArr < virtualLen){

                    if(virtualLen < actualLen){
                            my_array[virtualLen] = my_array[readArr];
                        }
                    if(my_array[readArr] === 0){
                        virtualLen--;
                        if(virtualLen < actualLen){
                            my_array[virtualLen] = 0;
                        }
                    }
                    virtualLen--;
                    readArr--;
                   
                }
                console.log("updated array with double zeros", my_array)
            }
            const arr = [7, 13, 29, 8, 35, 0];
            doubleZero(arr);
            
    }

    return (
        <nav className="w-full left-2 p-4 flex justify-between right-4 top-5 absolute bg-white text-gray-800 ">
            <div className="toggle md:hidden sm:block text-white">
                <button 
                onClick={() => {
                    setMenuVisible(!menuVisible)
                    console.log("ToggleMenu clicked ");
                    
                }}
                aria-label="toggle-Menu" 
                className="p-3 rounded-md border transition-transform duration-300 hover:scale-125 hover:bg-blue-600"> <FaBars />
                </button>
            </div>
            {console.log("menuVisible Value", menuVisible)}
            <ul className={`flex sm:flex sm:w-full sm:justify-center ${menuVisible ? 'block' : 'hidden'} sm:block `}>
                <li>
                    <a href="#">
                        <button onClick={handleNewBlogClick} className="bg-blue-600 text-black rounded-full hover:bg-blue-700"> New Blog</button>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <button
                        onClick={handleAboutUs} 
                        className="bg-red-600 text-black rounded-full hover:bg-red-800"
                        > aBouT uS</button>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <button className="bg-green-600 text-black rounded-full hover:bg-green-700"> Products</button>
                    </a>
                </li>
            </ul>
        </nav>
    )
}
