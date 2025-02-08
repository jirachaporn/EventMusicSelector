import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Playlist from "../Playlist/Playlist";
import { useNavigate } from "react-router-dom";
import CDImage from "../../assets/CD.jpeg";

function Selector() {
  const navigate = useNavigate(); 


  const themes = ["Select", "Wedding","Night party","Birthday party","Buddhist","Christian","Funeral","Luxury","Farewell","Christmas"];
  const genres = ["Select", "All", "Pop", "Jazz", "EDM", "Lo-Fi", "Classical", "Rock"];
  const moods = ["Select", "All", "Fun", "Romantic", "Relax", "Uplifting", "Sad"];
  const languages = ["Select", "English", "Thai", "Japanese", "Korean"];

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    artist: "",
    songName: "",
    language: "",
    themes: "",
    genres: "",
    minDuration: "",
  });
  const [selectedMood, setSelectedMood] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [message, setMessage] = useState(""); // ข้อความแจ้งเตือน


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}DataBase/songV2.csv`);
        if (!response.ok) throw new Error("Failed to fetch CSV file");

        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder("utf-8");
        const csv = decoder.decode(result.value);

        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const modifiedSongs = results.data.map((song) => ({
              songName: song["ชื่อเพลง"] || "Unknown Song",
              artist: song["ชื่อนักร้อง"] !== "-" ? song["ชื่อนักร้อง"] : song["ชื่อวง"],
              duration: song["นาที"] ? parseDuration(song["นาที"]) : 0,
              url: song["ลิ้ง url"] || "#",
              genre: song["ประเภทเพลง"] ? song["ประเภทเพลง"].split(",").map(g => g.trim()) : [],
              theme: song["ธีมงาน"] ? song["ธีมงาน"].split(",").map(t => t.trim()) : [],
              language: song["ภาษา"] || "Unknown",
            }));
            setData(modifiedSongs);
          },
        });
      } catch (error) {
        console.error("Error loading CSV:", error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem("playlists", JSON.stringify(playlists));
    }
  }, [playlists]);


  const savePlaylistToLocalStorage = (playlist) => {
    const existingPlaylists = JSON.parse(localStorage.getItem("playlists")) || [];
  
    // ตรวจสอบว่าเพลย์ลิสต์เดียวกันถูกเพิ่มซ้ำหรือไม่
    if (!existingPlaylists.some(p => JSON.stringify(p) === JSON.stringify(playlist))) {
      existingPlaylists.push(playlist);
      localStorage.setItem("playlists", JSON.stringify(existingPlaylists));
    }
  };

  const parseDuration = (durationStr) => {
    console.log("Raw duration string:", durationStr); // Add this line to log the raw duration string
    if (!durationStr || typeof durationStr !== "string") {
      console.warn("Invalid or missing duration:", durationStr);
      return 0;
    }
  
    const parts = durationStr.split(":").map(Number);
  
    let seconds = 0;
    if (parts.length === 2) { // นาทีและวินาที
      seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 3) { // ชั่วโมง นาที และวินาที
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 1) { // วินาทีเท่านั้น
      seconds = parts[0];
    } else {
      console.warn("Invalid duration format:", durationStr);
      return 0;
    }
  
    console.log("Parsed duration:", seconds); // เก็บไว้สำหรับตรวจสอบ
    return seconds;
  };
  

  const filteredData = data.filter((song) => {
    const searchTerm = filters.searchTerm?.toLowerCase() || "";
    return (
      (searchTerm === "" ||
        song.songName.toLowerCase().includes(searchTerm) ||
        song.artist.toLowerCase().includes(searchTerm)) &&
      (filters.language === "" || song.language.includes(filters.language)) &&
      ( !filters.themes || filters.themes.length === 0 || filters.themes.some((theme) => song.theme.includes(theme))) && 
      (!filters.genres || filters.genres.length === 0 || filters.genres.some((genre) => song.genre.includes(genre)))  &&  
      (filters.minDuration === "" || song.duration >= parseInt(filters.minDuration))
    );
});


  const shuffleArray = (array) => {
    const shuffled = [...array];
  
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap ตำแหน่ง
    }
  
    return shuffled;
  };

  const createPlaylists = () => {
    setMessage(""); 
    if (filteredData.length === 0) {
      setMessage("ไม่สามารถสร้างเพลย์ลิสต์ที่ตรงตามเงื่อนไขได้");
      return;
    }
  
    setPlaylists([]);
    localStorage.removeItem("playlists");
  
    const newPlaylists = [];
    const numberOfPlaylistsToCreate = 5;
  
    for (let i = 0; i < numberOfPlaylistsToCreate; i++) {
      let playlistSongs = [];
      let totalDuration = 0;
  
      let availableSongs = shuffleArray([...filteredData]);
  
      const minSongs = 5;
      const maxSongs = Math.min(filteredData.length, 80);
      const numSongs = Math.floor(Math.random() * (maxSongs - minSongs + 1)) + minSongs;
  
      for (let j = 0; j < numSongs && availableSongs.length > 0; j++) {
        const song = availableSongs[j]; 
        playlistSongs.push(song);
        totalDuration += song.duration;
      }
  
      // ตรวจสอบว่า totalDuration เพียงพอหรือไม่
  
      const playlistDuration = {
        hours: Math.floor(totalDuration / 3600),
        minutes: Math.floor((totalDuration % 3600) / 60),
        seconds: totalDuration % 60,
      };
  
      newPlaylists.push({
        name: `Play ${i + 1}`,
        songs: playlistSongs.map(song => ({
          ...song,
          url: song.url
      })),
        totalDuration: playlistDuration,
        genres: [...new Set(playlistSongs.flatMap((song) => song.genre))],
      });
    }
  
    setPlaylists(newPlaylists);
    localStorage.setItem("playlists", JSON.stringify(newPlaylists));

    navigate("/playlist");
  };


  return (
    
    <div className="w-full h-3/4 flex justify-center items-center bg-[#F7D7D1] p-6">
      <div className="flex w-full max-w-7xl">
        <div className="flex-shrink-0 w-1/2 pr-24 flex items-center">
          <img
            src={CDImage}
            alt="CD Image"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        <div className="w-1/2 pl-20">
          <div className="grid grid-cols-2 gap-6 mt-4">
            {/* Theme */}
            
              <div className="relative">
                <label className="block mb-2 text-black font-semibold text-2xl">Theme</label>
                <select 
                  className="w-full p-4 border rounded-md text-black text-lg" 
                  value={filters.themes}
                  onChange={(e) => setFilters({ ...filters, themes: [e.target.value] })} >
                  {themes.map((theme, index) => (
                    <option key={index} value={theme}>{theme}</option>
                  ))}
                </select>
              </div>
            

            {/* Music Genres */}
              
              <div className="relative">
                <label className="block mb-2 text-black font-semibold text-2xl">Music Genres</label>
                <select 
                  className="w-full p-4 border rounded-md text-black text-lg" 
                  value={filters.genres}
                  onChange={(e) => setFilters({ ...filters, genres: [e.target.value] }) } >
                  {genres.map((genre, index) => (
                    <option key={index} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
            

            {/* Mood */}
            <div className="relative">
              <label className="block mb-2 text-black font-semibold text-2xl">Mood</label>
              <select 
                className="w-full p-4 border rounded-md text-black text-lg" 
                value={selectedMood} 
                onChange={(e) => setSelectedMood(e.target.value)}
              >
                {moods.map((mood, index) => (
                  <option key={index} value={mood}>{mood}</option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="relative">
              <label className="block mb-2 text-black font-semibold text-2xl">Language</label>
              <select className="w-full p-4 border rounded-md text-black text-lg" value={filters.language} onChange={(e) => setFilters({ ...filters, language: e.target.value })}>
                {languages.map((lang, index) => (
                  <option key={index}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Name of Artist */}
            <div className="col-span-2 relative">
              <label className="block mb-2 text-black font-semibold text-2xl">Name of Artist</label>
              <input type="text" className="w-full p-4 border rounded-md text-black text-lg" placeholder="Name of Artist" value={filters.searchTerm || ""} onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })} />
            </div>

            {/* ปุ่ม */}
            <div className="flex justify-end space-x-4 col-span-2 mt-4">
              <button className="bg-[#FFB2BD] text-[#8F4A56] text-lg py-3 px-6 rounded-md">
                Cancel
              </button>
              <button 
                href = {<Playlist/>}
                className="bg-[#8F4A56] text-white text-lg py-3 px-6 rounded-md " 
                onClick={() => { createPlaylists();  }}
              >
                Done
              </button>
            </div>
          </div>
                
            {message && <div className="text-red-600 font-bold text-center mt-6 w-full ">{message} !!</div>}

        </div>
      </div>
    </div>
  );
}

export default Selector;
