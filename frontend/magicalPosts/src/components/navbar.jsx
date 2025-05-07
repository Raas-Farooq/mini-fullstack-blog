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
        //     function bubbleSort(arr){
        //         let count = 0;
        //         const arrLength=arr.length;
        //         for(let i=0; i< arrLength; i++){
        //             console.log("i value; ", i);
        //             let swapped=false;
        //             for(let j=0; j< arrLength-i-1; j++){
        //                 count++;
        //                 if(arr[j] > arr[j+1]){
        //                     let temp = arr[j];
        //                     arr[j] = arr[j+1];
        //                     arr[j+1] = temp;
        //                     swapped = true;
        //                 }
        //             }
        //             if(!swapped){
        //                 console.log("arry is sorted", arr)
        //                 return arr;
        //             }
                    
        //         }
        //     }
        //     const arr = [1,2,3,4,3,6,99,11, 5,8]
        //    const sortedArr= bubbleSort(arr)
        //     console.log("sorted: arr ", sortedArr);
        //     if(sortedArr){
        //         function binarySearch(sortedArr){
        //             let count = 0;
        //             let start = 0;
        //             let end= sortedArr.length - 1;
        //             const found = 1;
        //             while(start<= end){
        //                 let mid = Math.floor((start+end)/2);
        //                 console.log('count ', ++count)
        //                 if(sortedArr[mid] === found){
        //                     console.log("number found ");
        //                     return;
        //                 }
        //                 if(sortedArr[mid] < found){
        //                     start = mid +1;
        //                 }
        //                 if(sortedArr[mid] > found){
        //                     end=mid-1;
        //                 }
        //             }
        //             console.log("Number Not found")
        //         }

        //         binarySearch(sortedArr)
        //     }
            
        const arr=[1,2,4,3,5, 10, 7, 2];
        const num = arr.length-1;
 
        function multiply(num){
                if(num <= 0){
                    return 1;
                }

                const result = arr[num] * multiply(num - 1);
                
                return result;
            }
        console.log("multiply result: ", multiply(num));
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