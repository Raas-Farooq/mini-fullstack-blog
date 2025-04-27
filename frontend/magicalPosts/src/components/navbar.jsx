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


            function printPyramid(){
                const data = [
                    "Today's life lesson emphasizes the importance of paying attention to your thoughts ![image]-1343 when you're alone and practicing positive self-talk to influence your emotions and behaviors positively Additionally,![image]-1345 it's crucial to be mindful of your words when interacting with others,![image]-1366 as they can significantly impact relationships and personal growth.![image]-1327 Another lesson is to focus on the present moment, avoiding dwelling on the past or worrying excessively about the future, which can prevent you from enjoying life's current experiences.These lessons encourage self-awareness, positive communication, and mindfulness, all of which can enhance personal well-being and interpersonal relationships."]
                    const sections = data[0].split(/(!\[image\]-\d+)/g);
                    console.log("sections: ", sections);
                    const joinedContent = sections.map((section, index) => {
                        if(section.startsWith('![image]')){
                            return <img
                            alt={`${index}-${section}`}
                            />
                        }
                        return <p key={`text-${index}`}>{section} </p>
                    })
                    console.log("joinedContent: ", joinedContent);
                    
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