import React from "react";
import backgroundImage from "../../assets/background.png";


function Home() {
  return (
    <div
      className=" h-screen  bg-cover bg-center  relative flex flex-col"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      
      <div className="flex flex-col items-end h-full justify-center pr-40">
        <h1 className="text-5xl font-bold text-black leading-relaxed text-right">
            🎵 "Easily create playlists that 
            <br />
            match your theme!"
        </h1>
        <p className="text-lg text-black max-w-md leading-relaxed text-right mt-8 self-end mr-24">
            Select your theme, pick the mood, and build a playlist
            <br />
            that fits your event in just a few clicks! 🎶
        </p>
        <button className="bg-red-600 hover:bg-red-700 text-white text-lg py-2 px-6 rounded-md mt-10 self-end mr-52">
            Let&apos;s Start
        </button>
      </div>
    </div>
  );
}

export default Home;
