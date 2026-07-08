import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home/Home';
import AddPost from './Pages/AddPost/AddPost';
import './App.css'
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/addpost' element={<AddPost/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;