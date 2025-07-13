import React from "react";
import backgroundImage from "../../assets/background.png";

function Home() {
  return (
    <div
      className="h-screen bg-cover bg-center relative flex flex-col"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex flex-col h-full justify-center items-end lg:pr-40 px-6 md:px-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black leading-relaxed text-right lg:text-right text-center w-full lg:w-auto">
          🎵 "Easily create playlists that 
          <br className="hidden sm:block" />
          match your theme!"
        </h1>

        <p className="text-base sm:text-lg text-black max-w-md leading-relaxed mt-6 lg:mt-8 lg:text-right text-center w-full lg:w-auto">
          Select your theme, pick the mood, and build a playlist
          <br className="hidden sm:block" />
          that fits your event in just a few clicks! 🎶
        </p>

        <div className="mt-8 lg:mt-10 w-full flex justify-center lg:justify-end">
          <button className="bg-red-600 hover:bg-red-700 text-white text-lg py-2 px-6 rounded-md">
            Let&apos;s Start
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
