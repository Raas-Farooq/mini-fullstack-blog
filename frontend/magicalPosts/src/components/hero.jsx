

export default function Hero() {

        function deliberate(){
            const obj = {first:1, last: 'go',
                third:{
                    run: () => {
                        return "Running.."
                    }
                    
                }
            }
            console.log("USE YOUR BRAIN: ", obj.third.run())
        }

        deliberate();
    return (
        <>
            <h2> Are You Believer in Allah (SWT)</h2>
            <div className="h-screen ">
                <img src="bestPic.jpg" alt="Blogs" className="lg:h-4/5 md:h-3/5 lg:w-full object-cover object-center" />
            </div>
            <p className="text-white xs:text-blue-600 absolute top-1/2 right-1/2"> THis is the Special Moment for Us? </p>
        </>
    )
}

