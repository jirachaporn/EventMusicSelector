import React from "react";

function Reccom() {
  const playlists = [
    {
      title: "Wedding",
      mood: "Romantic",
      image: "./Image/wedding.jpg"
    },
    {
      title: "Night Party",
      mood: "Dance",
      image: "./Image/Night Party.jpg"
    },
    {
      title: "Birthday Party",
      mood: "Celebratory",
      image: "./Image/Birthday party.jpg"
    },
    {
      title: "Buddhist Ceremony",
      mood: "Uplifting",
      image: "./Image/Buddhist.jpg"
    },
    {
      title: "Christian Ceremony",
      mood: "Worshipful",
      image: "./Image/Christian.jpg"
    },
    {
      title: "Funeral",
      mood: "Sad",
      image: "./Image/funeral.jpg"
    },
    {
      title: "Halloween Party",
      mood: "Spooky",
      image: "./Image/Halloween.jpg"
    },
    {
      title: "Chinese New Year",
      mood: "Celebratory",
      image: "./Image/Chinese New Year.jpg"
    },
    {
      title: "Luxury Party",
      mood: "Elegant",
      image: "./Image/Luxury.jpg"
    },
    {
      title: "Christmas",
      mood: "Celebratory",
      image: "./Image/Christmas.jpg"
    },
    {
      title: "Graduation Party",
      mood: "Nostalgic",
      image: "./Image/Graduation party.jpg"
    },
  ];

  return (
    <div className="w-full h-auto flex flex-col bg-[#F7D7D1] p-6">
      <h1 className="text-3xl font-bold text-black leading-relaxed text-left pl-6">Recommend</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-4">
        {playlists.map((playlist, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={playlist.image}
              alt={playlist.mood}
              className="w-full h-auto object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-900">{playlist.title}</h2>  
              <p className="text-sm text-gray-500">{playlist.mood}</p>  
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reccom;
