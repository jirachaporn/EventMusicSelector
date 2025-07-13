import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
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

    const indexInLiked = newLikedPlaylists.findIndex(p => p.name === playlist.name);
    if (indexInLiked !== -1) {
      newLikedPlaylists.splice(indexInLiked, 1);
    } else {
      newLikedPlaylists.push(playlist);
    }

    setLikedPlaylists(newLikedPlaylists);
    localStorage.setItem("likedPlaylist", JSON.stringify(newLikedPlaylists));
  };

  return (
    <div className="p-4 bg-[#F7D7D1] min-h-screen text-black text-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-5 mb-6">
        <button
          onClick={() => navigate("/")}
          className="text-2xl px-4 py-2 bg-white rounded-xl shadow hover:bg-gray-200"
        >
          ←
        </button>
        <div className="bg-[#A35D4E] px-6 py-3 rounded-md w-full max-w-xl text-center">
          <h1 className="text-2xl font-bold text-white">🎵 Playlist</h1>
        </div>
      </div>

      {/* Playlist Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {playlists.map((playlist, index) => (
          <div
            key={index}
            className="relative border p-4 rounded-xl bg-white shadow hover:shadow-lg cursor-pointer"
            onClick={() => setSelectedPlaylist(index)}
          >
            <div className="flex gap-4 items-center">
              <div className="bg-blue-400 text-white rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold">
                {playlist.name.slice(-1)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-blue-600">{playlist.name}</h2>
                <p>จำนวนเพลง: {playlist.songs.length}</p>
                <p>
                  ระยะเวลา: {playlist.totalDuration.hours.toString().padStart(2, '0')}:
                  {playlist.totalDuration.minutes.toString().padStart(2, '0')}:
                  {playlist.totalDuration.seconds.toString().padStart(2, '0')}
                </p>
                <p>แนวเพลง: {playlist.genres.join(", ")}</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLikePlaylist(index);
              }}
              className={`absolute top-4 right-4 text-xl ${likedPlaylists.some(p => p.name === playlist.name)
                  ? "text-red-500"
                  : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {likedPlaylists.some(p => p.name === playlist.name) ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPlaylist !== null && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] z-50 flex justify-center items-start overflow-auto py-10 px-4">
          <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg p-6 relative">

            {/* Header: Back Button + Heart */}
            <div className="flex flex-col gap-6 border-b pb-6 mb-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedPlaylist(null)}
                  className="text-base md:text-lg px-5 py-2 bg-[#A35D4E] text-white rounded-lg hover:bg-[#8f3d3d] transition font-semibold"
                >
                  ← กลับ
                </button>

                <button
                  onClick={() => handleLikePlaylist(selectedPlaylist)}
                  className={`text-2xl ${likedPlaylists.some(p => p.name === playlists[selectedPlaylist].name)
                      ? "text-red-500"
                      : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {likedPlaylists.some(p => p.name === playlists[selectedPlaylist].name) ? (
                    <FaHeart />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              </div>

              {/* Playlist Info */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="bg-blue-400 text-white text-3xl font-bold rounded-full w-20 h-20 flex items-center justify-center">
                  {playlists[selectedPlaylist].name.slice(-1)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{playlists[selectedPlaylist].name}</h2>
                  <p className="text-gray-600">
                    ระยะเวลารวม: {playlists[selectedPlaylist].totalDuration.hours.toString().padStart(2, '0')}:
                    {playlists[selectedPlaylist].totalDuration.minutes.toString().padStart(2, '0')}:
                    {playlists[selectedPlaylist].totalDuration.seconds.toString().padStart(2, '0')}
                  </p>
                  <p className="text-gray-600">แนวเพลง: {playlists[selectedPlaylist].genres.join(", ")}</p>
                  <p className="text-gray-600">จำนวนเพลง: {playlists[selectedPlaylist].songs.length}</p>
                </div>
              </div>
            </div>

            {/* Song List */}
            <ul className="mt-4 space-y-4">
              {playlists[selectedPlaylist].songs.map((song, idx) => (
                <li
                  key={idx}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg shadow hover:bg-gray-100"
                  onClick={() => setNowPlaying(song)}
                >
                  <div className="flex items-center gap-4">
                    {song.url && song.url !== "#" && (
                      <iframe
                        src={song.url}
                        className="w-40 h-20 rounded-md"
                        allow="autoplay"
                      ></iframe>
                    )}
                    <div>
                      <p className="font-semibold">{song.songName}</p>
                      <p className="text-sm text-gray-600">{song.artist}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 self-end md:self-center">
                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}


      {/* Now Playing (optional future section) */}
      {/* {nowPlaying && (
        <div className="fixed bottom-0 left-0 w-full bg-[#DFA194] p-3 border-t border-black rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">{nowPlaying.songName}</p>
              <p className="text-sm text-gray-700">{nowPlaying.artist}</p>
            </div>
            <button
              onClick={() => setNowPlaying(null)}
              className="text-red-500 hover:text-red-700 text-xl"
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
