import React, { useEffect, useState, useRef } from "react";
import { FaHeart, FaEdit, FaBookOpen, FaSearch, FaArrowRight, FaTrash, FaEllipsisH } from "react-icons/fa";

function Favorite() {
  const [likedPlaylists, setLikedPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [actionMenuVisible, setActionMenuVisible] = useState(null);
  const [targetPlaylist, setTargetPlaylist] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State to hold search term
  const actionMenuRef = useRef(null); // Reference to action menu

  useEffect(() => {
    const storedLikedPlaylists = JSON.parse(localStorage.getItem("likedPlaylist"));
    if (storedLikedPlaylists) {
      setLikedPlaylists(storedLikedPlaylists);
    }
  }, []);

  useEffect(() => {
    // Add event listener to close action menu if clicked outside
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setActionMenuVisible(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUnlikePlaylist = (index) => {
    const newLikedPlaylists = likedPlaylists.filter((_, i) => i !== index);
    setLikedPlaylists(newLikedPlaylists);
    localStorage.setItem("likedPlaylist", JSON.stringify(newLikedPlaylists));
    setSelectedPlaylist(null);
  };

  const handleEditPlaylistName = () => {
    if (selectedPlaylist !== null) {
      const updatedPlaylists = [...likedPlaylists];
      updatedPlaylists[selectedPlaylist].name = newPlaylistName;
      setLikedPlaylists(updatedPlaylists);
      localStorage.setItem("likedPlaylist", JSON.stringify(updatedPlaylists));
      setIsEditing(false);
    }
  };

  const handleRemoveSong = (songIndex) => {
    const updatedPlaylist = [...likedPlaylists[selectedPlaylist].songs];
    updatedPlaylist.splice(songIndex, 1);
    const updatedPlaylists = [...likedPlaylists];
    updatedPlaylists[selectedPlaylist].songs = updatedPlaylist;
    setLikedPlaylists(updatedPlaylists);
    localStorage.setItem("likedPlaylist", JSON.stringify(updatedPlaylists));
  };

  const handleMoveSong = (songIndex) => {
    if (targetPlaylist === null) {
      alert("Please select a target playlist.");
      return;
    }
    const songToMove = likedPlaylists[selectedPlaylist].songs[songIndex];
    const updatedPlaylists = [...likedPlaylists];
    updatedPlaylists[selectedPlaylist].songs.splice(songIndex, 1);
    updatedPlaylists[targetPlaylist].songs.push(songToMove);
    setLikedPlaylists(updatedPlaylists);
    localStorage.setItem("likedPlaylist", JSON.stringify(updatedPlaylists));
    setTargetPlaylist(null);
    setActionMenuVisible(null); // Close action menu after moving
  };

  // Filter playlists based on search term
  const filteredPlaylists = likedPlaylists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-black bg-[#F7D7D1]  p-20 flex">
      <div className="w-1/4 pr-8 bg-white p-5 rounded-lg shadow-lg hover:shadow-2xl">
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
                className="flex items-center border p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200"
                onClick={() => setSelectedPlaylist(index)}
              >
                <div className="m-2 p-6 bg-blue-400 h-fit w-fit"></div>
                <div className="flex-grow">
                  <p className="font-semibold">{playlist.name}</p>
                  <p className="text-gray-500">{playlist.songs.length} songs</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnlikePlaylist(index);
                  }}
                  className="text-red-500 hover:text-gray-500 transition"
                >
                  {/* <FaHeart /> */}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No playlists found.</p>
          )}
        </div>
      </div>

      <div className="w-3/4 pl-8">
        {selectedPlaylist !== null ? (
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 relative">
            <button
              onClick={() => handleUnlikePlaylist(selectedPlaylist)}
              className="absolute top-4 right-4 text-red-500 text-xl"
            >
              <FaHeart />
            </button>

            <div className="flex items-start mb-4">
              <div className="m-2 p-20 bg-blue-400 h-fit w-fit"></div>
              <div className="ml-4">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      className="w-1/2 border rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                    />
                    <button
                      onClick={handleEditPlaylistName}
                      className="bg-[#8F4A56] text-white px-4 py-2 rounded-lg ml-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-[#FFB2BD] text-[#561D29] px-4 py-2 rounded-lg ml-2"
                    >
                      Cancel
                    </button>
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

            <ul>
              {likedPlaylists[selectedPlaylist].songs.map((song, songIndex) => (
                <li key={songIndex} className="border-b p-4 flex items-center relative">
                  {song.url && song.url !== "#" && (
                    <iframe
                      src={song.url}
                      className="border rounded-md h-fit w-fit"
                      allow="autoplay"
                    ></iframe>
                  )}
                  {/* <div className="m-2 p-6 bg-blue-400 h-fit w-fit"></div> */}
                  <span className="p-4">
                    {song.songName} - {song.artist} ({Math.floor(song.duration / 60)}:
                    {(song.duration % 60).toString().padStart(2, '0')})
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActionMenuVisible(actionMenuVisible === songIndex ? null : songIndex);
                    }}
                    className="ml-auto text-black hover:text-black "
                  >
                    <FaEllipsisH />
                  </button>

                  {actionMenuVisible === songIndex && (
                    <div ref={actionMenuRef} className="absolute top-2 right-10 bg-white border p-2 rounded shadow-lg mt-2 w-40">
                      <button
                        onClick={() => handleMoveSong(songIndex)}
                        className="block text-blue-500 mb-2 w-full py-1 px-2 rounded-md"
                      >
                        Move song
                      </button>
                      <select
                        onChange={(e) => setTargetPlaylist(Number(e.target.value))}
                        className="block w-full mb-2 border p-2 rounded-md"
                      >
                        <option value={null}>Select Playlist</option>
                        {likedPlaylists.map((playlist, index) => (
                          <option key={index} value={index}>
                            {playlist.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleRemoveSong(songIndex)}
                        className="block text-red-600 w-full py-1 px-2 rounded-md"
                      >
                        Remove song
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center text-gray-500">No favorite playlists yet.</p>
        )}
      </div>
    </div>
  );
}

export default Favorite;
