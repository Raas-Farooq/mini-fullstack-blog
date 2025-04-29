import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './hero';
import App from '../App';
import NewBlog from './newBlog';
import DisplayBlogs from './displayBlogs';
import DisplayPost from './displayPost';
import EditPost from './editingPost/editPost.jsx';

const AppRoutes = () => {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path='/hero' element={<Home />}  />
                <Route path="/newBlog" element={<NewBlog />} />
                <Route path='/post/:id' element={<DisplayPost />} />
                <Route path='/edit/:id' element={<EditPost />} />
            </Routes>
         </Router>
       
    )
}

export default AppRoutes
