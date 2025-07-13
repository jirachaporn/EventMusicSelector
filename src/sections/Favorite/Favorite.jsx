import React, { useEffect, useState, useRef } from "react";
import { FaHeart, FaEdit, FaBookOpen, FaSearch, FaEllipsisH } from "react-icons/fa";

function Favorite() {
  const [likedPlaylists, setLikedPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [actionMenuVisible, setActionMenuVisible] = useState(null);
  const [targetPlaylist, setTargetPlaylist] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const actionMenuRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("likedPlaylist"));
    if (stored) setLikedPlaylists(stored);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setActionMenuVisible(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleUnlikePlaylist = (index) => {
    const updated = likedPlaylists.filter((_, i) => i !== index);
    setLikedPlaylists(updated);
    localStorage.setItem("likedPlaylist", JSON.stringify(updated));
    setSelectedPlaylist(null);
  };

  const handleEditPlaylistName = () => {
    if (selectedPlaylist !== null) {
      const updated = [...likedPlaylists];
      updated[selectedPlaylist].name = newPlaylistName;
      setLikedPlaylists(updated);
      localStorage.setItem("likedPlaylist", JSON.stringify(updated));
      setIsEditing(false);
    }
  };

  const handleRemoveSong = (songIndex) => {
    const updatedPlaylist = [...likedPlaylists[selectedPlaylist].songs];
    updatedPlaylist.splice(songIndex, 1);
    const updated = [...likedPlaylists];
    updated[selectedPlaylist].songs = updatedPlaylist;
    setLikedPlaylists(updated);
    localStorage.setItem("likedPlaylist", JSON.stringify(updated));
  };

  const handleMoveSong = (songIndex) => {
    if (targetPlaylist === null) {
      alert("Please select a target playlist.");
      return;
    }
    const songToMove = likedPlaylists[selectedPlaylist].songs[songIndex];
    const updated = [...likedPlaylists];
    updated[selectedPlaylist].songs.splice(songIndex, 1);
    updated[targetPlaylist].songs.push(songToMove);
    setLikedPlaylists(updated);
    localStorage.setItem("likedPlaylist", JSON.stringify(updated));
    setTargetPlaylist(null);
    setActionMenuVisible(null);
  };

  const filteredPlaylists = likedPlaylists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-black bg-[#F7D7D1] p-4 sm:p-8 lg:p-20 flex flex-col lg:flex-row gap-6 min-h-screen">

      {/* Sidebar */}
      <div className="w-full lg:w-1/3 bg-white p-5 rounded-lg shadow-lg hover:shadow-2xl">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FaBookOpen className="mr-2 text-xl" />
          Your Favorite Playlist
        </h2>

        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full border rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredPlaylists.length > 0 ? (
            filteredPlaylists.map((playlist, index) => (
              <div
                key={index}
                className="flex items-center border p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                onClick={() => setSelectedPlaylist(index)}
              >
                <div className="bg-blue-400 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg mr-4">
                  {playlist.name.slice(-1)}
                </div>
                <div className="flex-grow">
                  <p className="font-semibold">{playlist.name}</p>
                  <p className="text-gray-500">{playlist.songs.length} songs</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No playlists found.</p>
          )}
        </div>
      </div>

      {/* Playlist Detail */}
      <div className="w-full lg:w-2/3">
        {selectedPlaylist !== null ? (
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start">
                <div className="bg-blue-400 rounded-full w-20 h-20 flex items-center justify-center text-white font-bold text-2xl mr-4">
                  {likedPlaylists[selectedPlaylist].name.slice(-1)}
                </div>
                <div>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        className="w-full border rounded-md p-2 mb-2"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleEditPlaylistName}
                          className="bg-[#8F4A56] text-white px-4 py-2 rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="bg-[#FFB2BD] text-[#561D29] px-4 py-2 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold flex items-center">
                        {likedPlaylists[selectedPlaylist].name}
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setNewPlaylistName(likedPlaylists[selectedPlaylist].name);
                          }}
                          className="ml-2 text-black hover:text-gray-700"
                        >
                          <FaEdit />
                        </button>
                      </h2>
                      <p>จำนวนเพลง: {likedPlaylists[selectedPlaylist].songs.length}</p>
                      <p>
                        ระยะเวลา: {likedPlaylists[selectedPlaylist].totalDuration.hours.toString().padStart(2, '0')}:
                        {likedPlaylists[selectedPlaylist].totalDuration.minutes.toString().padStart(2, '0')}:
                        {likedPlaylists[selectedPlaylist].totalDuration.seconds.toString().padStart(2, '0')}
                      </p>
                      <p>ประเภทเพลง: {likedPlaylists[selectedPlaylist].genres.join(", ")}</p>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleUnlikePlaylist(selectedPlaylist)}
                className="text-red-500 text-xl"
              >
                <FaHeart />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              <ul className="space-y-2">
                {likedPlaylists[selectedPlaylist].songs.map((song, songIndex) => (
                  <li
                    key={songIndex}
                    className="border p-4 rounded-md flex items-center gap-4 relative bg-gray-50 hover:bg-gray-100"
                  >
                    {song.url && song.url !== "#" && (
                      <iframe
                        src={song.url}
                        className="w-40 h-24 rounded"
                        allow="autoplay"
                      ></iframe>
                    )}
                    <div className="flex-grow">
                      <p className="font-semibold">{song.songName}</p>
                      <p className="text-sm text-gray-600">{song.artist}</p>
                      <p className="text-sm text-gray-500">
                        {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                      </p>
                    </div>

                    <div className="relative inline-block text-left">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionMenuVisible(actionMenuVisible === songIndex ? null : songIndex);
                          setTargetPlaylist(null); // reset target playlist on open
                        }}
                        className="ml-auto text-black hover:text-gray-700"
                      >
                        <FaEllipsisH />
                      </button>

                      {actionMenuVisible === songIndex && (
                        <div
                          ref={actionMenuRef}
                          className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 text-sm"
                        >
                          <div className="px-4 pt-3 pb-1 text-gray-700 font-semibold">
                            Select target playlist
                          </div>
                          <select
                            value={targetPlaylist ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTargetPlaylist(val === "" ? null : Number(val));
                            }}
                            className="w-full px-4 py-2 border-t border-gray-200 focus:outline-none"
                          >
                            <option value="">-- Select --</option>
                            {likedPlaylists.map((p, i) =>
                              i !== selectedPlaylist ? (
                                <option key={i} value={i}>
                                  {p.name}
                                </option>
                              ) : null
                            )}
                          </select>

                          {targetPlaylist !== null && (
                            <button
                              onClick={() => handleMoveSong(songIndex)}
                              className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 font-medium border-t border-gray-100 transition"
                            >
                              Move playlist
                            </button>
                          )}

                          <button
                            onClick={() => handleRemoveSong(songIndex)}
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium border-t border-gray-100 transition"
                          >
                            Remove this song
                          </button>
                        </div>
                      )}

                    </div>



                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No favorite playlists yet.</p>
        )}
      </div>
    </div>
  );
}

export default Favorite;
