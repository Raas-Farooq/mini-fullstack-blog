import { useState } from "react";
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
            
            function mergeArrays(arr1,arr2){
                let i=0; let j=0;
                let merged=[];
                const arr1_len = arr1.length;
                const arr2_len = arr2.length;
                console.log("array 1", arr1, "array 2: ", arr2, "arr1 leng ", arr1_len, " arr2_len ", arr2_len);
                while(i < arr1_len && j < arr2_len){
                    if(arr2[j] < arr1[i]){
                        console.log("j: ", j , "arr2[value] ", arr2[j]);
                        if(!(arr2[j] === 0)){
                            merged.push(arr2[j]);
                            j++
                        }
                        else{
                            j++
                        }
                    }
                    else{
                        if(arr1[i] === 0){
                            i++
                        }else{
                            merged.push(arr1[i]);
                            i++;
                        }
                    }
                }

                while(i < arr1_len){
                    merged.push(arr1[i]);
                    i++;
                }
                while(j < arr2_len){
                    // console.log("j: ", j);
                    merged.push(arr2[j]);
                    j++;
                }

                return merged;
            }

            const first = [3, 8, 35]; const second = [23, 55, 72,  91,99];

            console.log("result ", mergeArrays(first,second));
            // function doubleZero(my_array){
            //     let zeroCount = 0;
            //     my_array.forEach(num => {
            //         if(num===0){
            //             zeroCount++;
            //         }
            //     })
            //     const storedZeroCount= zeroCount;
            //     let array_length = my_array.length;
            //     let lastPos = array_length-1;
            //     while(zeroCount > 0 && lastPos >= 0){
            //         if(my_array[lastPos] === 0){
            //             zeroCount--;
            //         }
            //         lastPos--
            //     }

            //     let readPos = array_length - storedZeroCount - 1;
            //     let writePos= array_length - 1;
            //     console.log(`readPos ${readPos} writePos ${writePos} zroCoutn ${storedZeroCount} lastPos ${lastPos}`)
            //     while(readPos > lastPos){
            //         if(my_array[readPos] === 0){
            //             my_array[writePos] = 0;
            //             writePos--
            //         }else{
            //             my_array[writePos] = my_array[readPos];
            //         }
            //         writePos--;
            //         readPos--;
            //     }

            //     console.log("updated array with double zeros", my_array)
            // }
            // const arr = [2, 13, 29, 0, 35, 0, 3, 9, 6];
            // doubleZero(arr);
            
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

// className={clsx
//     ('hidden flex sm:flex sm:w-full sm:justify-center ', menuVisible ? 'block flex flex-col ' : 'hidden')}>

// contentImage as formImg befre appending  
// File {name: 'comfort zone.jpg', lastModified: 1728897784071, lastModifiedDate: Mon Oct 14 2024 14:23:04 GMT+0500 (Pakistan Standard Time), webkitRelativePath: '', size: 48411, …}
// lastModified
// : 
// 1728897784071
// lastModifiedDate
// : 
// Mon Oct 14 2024 14:23:04 GMT+0500 (Pakistan Standard Time) {}
// name
// : 
// "comfort zone.jpg"
// size
// : 
// 48411
// type
// : 
// "image/jpeg"
// webkitRelativePath
// : 
// ""
// [[Prototype]]
// : 
// File