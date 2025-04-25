import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HandleCrud from './components/newBlog.jsx'
// import MyEditor from './components/myEditor'
import Navbar from './components/navbar.jsx';
import Hero from './components/hero.jsx'
import DisplayBlogs from './components/displayBlogs.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>    
      <Navbar />
      <Hero />
      <DisplayBlogs />
    </>
  )
}

export default App
