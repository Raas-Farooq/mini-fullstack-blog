import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
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
            
            function countOnes(){ 
                const nums= [1,1,0,1,1,1]
                let maxCount=0;
                let count=0;
                const arrLength=nums.length;
                for(let z=0; z<arrLength; z++){
                 if(nums[z] === 1){
                   count++;
                 }
                 else {
                    if(maxCount < count){
                        maxCount=count;
                    }
                    count=0
                  }
                  
                }
                console.log("countOnes", maxCount);
             }
        countOnes()
            function printPyramid(){
                const arr= [5, 5, 3,8, 9,5, 0,5, 5, 55,5,5,5,5,5,5,5,7];
 
                let maxCount=0;
                let count=0;
                const arrLength=arr.length;
                for(let z=0; z<arrLength; z++){
                 if(arr[z] === 5){
                    while(arr[z] === 5 && z < arrLength){
                        count++;
                        z++;
                    } 
                    
                 }
                 if(maxCount < count){
                    maxCount=count;
                    }

                count=0;
                }
                console.log("5 maximum consectively showing", maxCount);
                     
             }
        printPyramid()

        //     function pattern(num){

        //         for(let i = 0; i < num; i++){
        //             let symbol = '';
        //             for(let j=0; j<= i; j++){
        //                 symbol = symbol + '@';
        //             }
        //             console.log(symbol);
        //         }
        //     }

        //     pattern(6)
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