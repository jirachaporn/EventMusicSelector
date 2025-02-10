import React from "react";
import Main from "./sections/Home/Main";
import Playlist from "./sections/Playlist/Playlist";
import { Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Favorite from "./sections/Favorite/Favorite";

function App() {
  return (
    <>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/playlist" element={<Playlist />} /> 
        <Route path="/Favorite" element={<Favorite />} /> 
      </Routes>
    </>
  );
}

export default App;

