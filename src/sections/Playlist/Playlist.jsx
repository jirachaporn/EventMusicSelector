import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // นำเข้าไอคอนหัวใจ
import { useNavigate } from "react-router-dom";

function Playlist() {
  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [likedPlaylists, setLikedPlaylists] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);


  useEffect(() => {
    const storedPlaylists = JSON.parse(localStorage.getItem("playlists"));
    if (storedPlaylists) {
      setPlaylists(storedPlaylists);
    }

    const storedLikedPlaylists = JSON.parse(localStorage.getItem("likedPlaylist"));
    if (storedLikedPlaylists) {
      setLikedPlaylists(storedLikedPlaylists);
    }
  }, []);

  const handleLikePlaylist = (index) => {
    const newLikedPlaylists = [...likedPlaylists];
    const playlist = playlists[index];

    if (newLikedPlaylists.includes(playlist)) {
      newLikedPlaylists.splice(newLikedPlaylists.indexOf(playlist), 1);
    } else {
      newLikedPlaylists.push(playlist);
    }

    setLikedPlaylists(newLikedPlaylists);
    localStorage.setItem("likedPlaylist", JSON.stringify(newLikedPlaylists));
  };

  return (
    <div className="p-4 text-black text-lg bg-[#F7D7D1] min-h-screen">
      {/* Header */}

      <div className="  flex flex-row items-center justify-center h-full px-5">
        <button
          onClick={() => navigate("/")}
          className="fas fa-arrow-left text-2xl w-22 h-11  m-5 bg-[#ffffff] rounded-xl shadow-lg hover:bg-gray-100 "
        >
          ←
        </button>
        <div className="bg-[#A35D4E] p-4 rounded-md w-full text-center">
          <h1 className="text-2xl font-bold text-white">🎵 Playlist</h1>
        </div>
      </div>


      <div>
      {playlists.map((playlist, index) => (

            <div
              key={index}
              className="flex items-center border p-4 rounded-md m-5 cursor-pointer bg-white relative "
              onClick={() => setSelectedPlaylist(index)}
            >
              <p className="m-2 p-20 bg-blue-400 h-fit w-fit rounded-xl">{playlist.name.slice(-1)}</p>
              <div className="m-5">
                <h2 className=" flex font-bold text-xl text-blue-500">{playlist.name}</h2>
                <p>จำนวนเพลง: {playlist.songs.length}</p>
                <p>ระยะเวลา: {playlist.totalDuration.hours.toString().padStart(2, '0')}:{playlist.totalDuration.minutes.toString().padStart(2, '0')}:{playlist.totalDuration.seconds.toString().padStart(2, '0')}</p>
                <p>แนวเพลง: {playlist.genres.join(", ")}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikePlaylist(index);
                }}
                className={`text-end text-xl p-2 absolute top-4 right-4 rounded-full ${
                  likedPlaylists.includes(playlist) ? 'text-red-500' : 'text-gray-300 hover:text-gray-400'
                }`}
              >
                {likedPlaylists.includes(playlist) ? <FaHeart /> : <FaRegHeart />} {/* ใช้ไอคอนแทนข้อความ */}
              </button>
          </div>
        ))}
      </div>

      {selectedPlaylist !== null && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-10 w-full h-full overflow-auto">
          <div className="bg-white w-full max-w-6xl p-6 overflow-auto max-h-[70vh] rounded-md shadow-lg">
              
              <div className="sticky top-0 left-4">
                <button
                  onClick={() => setSelectedPlaylist(null)}
                  className=" fas fa-arrow-left z-10 w-22 h-11 bg-[#A35D4E] m-2 text-white text-3xl rounded-xl shadow-lg hover:bg-[#F7D7D1]"
                >
                  ←
                </button>
              </div>

            <div className="bg-white rounded-xl">
              <div className="flex items-center mt-5 border-b m-20 pt-4 relative">
                <p className="m-2 p-16  bg-blue-400 h-fit w-fit rounded-xl"> {playlists[selectedPlaylist].name.slice(-1)} </p>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold">{playlists[selectedPlaylist].name}</h2>
                  <p className="text-gray-600">
                    ระยะเวลารวม: {playlists[selectedPlaylist].totalDuration.hours.toString().padStart(2, '0')}:{playlists[selectedPlaylist].totalDuration.minutes.toString().padStart(2, '0')}:{playlists[selectedPlaylist].totalDuration.seconds.toString().padStart(2, '0')}
                  </p>
                  <p className="text-gray-600">
                    แนวเพลง: {playlists[selectedPlaylist].genres.join(", ")}
                  </p>
                  <p className="text-gray-600">
                    จำนวนเพลง: {playlists[selectedPlaylist].songs.length}
                  </p>
                </div>
              </div>
   

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikePlaylist(index);
                }}
                className={`text-end text-xl p-2 absolute top-4 right-4 rounded-full ${
                  likedPlaylists.includes(playlists[selectedPlaylist]) ? 'text-red-500' : 'text-gray-300 hover:text-gray-400'
                }`}
              >
                {likedPlaylists.includes(playlists[selectedPlaylist]) ? <FaHeart /> : <FaRegHeart />} {/* ใช้ไอคอนแทนข้อความ */}
              </button>
            </div>


            <ul className="mt-2 border border-gray-300 rounded-xl m-5 shadow-2xl shadow-gray-500/50">
              {playlists[selectedPlaylist].songs.map((song, idx) => (
                <li 
                  key={idx}
                  className="m-5 border-b py-2 flex justify-between items-center hover:bg-gray-100 transition-colors duration-200 bg-white p-4 rounded-md cursor-pointer"
                  onClick={() => setNowPlaying(song)} 
                >
                <div className="flex items-center">
                  {song.url && song.url !== "#" && (
                    <iframe
                      src={song.url}
                      className="rounded-md h-fit w-fit p-3"
                      allow="autoplay"
                    ></iframe>
                  )}
                  <div className=" p-5">
                    <p className="font-bold">{song.songName}</p>
                    <p className="text-sm text-gray-600">{song.artist}</p>
                  </div>
                  </div>

                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-600">
                      {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                    </p>
                    {/* เปลี่ยนปุ่ม Play เป็นจุด 3 จุด */}
                    
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

     {/* Now Playing */}
     {/* {nowPlaying && (
        <div className="fixed bottom-0 left-0 w-full bg-[#DFA194] p-2 px-15  border-t border-black rounded-xl  ">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">{nowPlaying.songName}</p>
              <p className="text-sm text-gray-600">{nowPlaying.artist}</p>
            </div>
            <button
              onClick={() => setNowPlaying(null)}
              className="text-red-500 hover:text-red-700"
            >
              ❌
            </button>
          </div>
        </div>
      )} */}

    </div>
  );
}

export default Playlist;
