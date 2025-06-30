import { useEffect } from "react"


export default function Hero() {

        useEffect(() => {
            localStorage.removeItem('previewTitleImage');
            localStorage.removeItem('textContent');
            localStorage.removeItem('titleImg');
            localStorage.removeItem('contentImagesUrls');
        })
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

