import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import CDImage from "../../assets/CD.jpeg";

function Selector() {
  const navigate = useNavigate();

  const themes = ["Select", "Wedding", "Night party", "Birthday party", "Buddhist", "Christian", "Funeral", "Luxury", "Graduation party", "Christmas party", "Chinese New Year", "Halloween party"];
  const genres = ["Select", "Pop", "Jazz", "EDM", "Lo-Fi", "Classical", "Rock", "Romantic", "Retro", "Hip-Hop", "ลูกทุ่ง", "ลูกกรุง", "เพื่อชีวิต", "Indie", "Country", "Alternative", "Rap", "R&B", "Chanson", "Opera", "Tango", "Bolero", "Swing", "Bossa Nova", "Soul", "Worship", "Hymn", "Carol", "Disco", "Traditional", "Soundtrack", "Metal"];
  const languages = ["Select", "English", "Thai", "Spanish", "French", "German", "Japanese", "Chinese", "Korean", "Instrumental", "ETC."];

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    artist: "",
    songName: "",
    language: "",
    themes: [],
    genres: [],
    minDuration: "",
  });

  const [playlists, setPlaylists] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}DataBase/songรวมเพลง.csv`);
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
              genre: song["ประเภทเพลง"] ? song["ประเภทเพลง"].split(",").map(g => g.trim()).filter(g => g !== "") : [],
              theme: song["ธีมงาน"] ? song["ธีมงาน"].split(",").map(t => t.trim()).filter(t => t !== "") : [],
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

  const parseDuration = (durationStr) => {
    if (!durationStr || typeof durationStr !== "string" || durationStr.trim() === "" || durationStr.includes("--")) {
      return 0;
    }
    const parts = durationStr.split(":").map(num => parseInt(num, 10) || 0);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0];
  };

  const filteredData = data.filter((song) => {
    const searchTerm = filters.searchTerm?.toLowerCase() || "";
    return (
      (searchTerm === "" || song.songName.toLowerCase().includes(searchTerm) || song.artist.toLowerCase().includes(searchTerm)) &&
      (filters.language === "" || song.language === filters.language) &&
      (filters.themes.length === 0 || filters.themes.every((theme) => song.theme.includes(theme))) &&
      (filters.genres.length === 0 || filters.genres.every((genre) => song.genre.includes(genre))) &&
      (filters.minDuration === "" || song.duration >= parseInt(filters.minDuration))
    );
  });

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const createPlaylists2 = () => {
    setMessage("");
    if (filteredData.length === 0) {
      setMessage("ไม่สามารถสร้างเพลย์ลิสต์ที่ตรงตามเงื่อนไขได้");
      return;
    }

    setPlaylists([]);
    localStorage.removeItem("playlists");

    const newPlaylists = [];
    for (let i = 0; i < 5; i++) {
      let playlistSongs = [];
      let totalDuration = 0;
      let availableSongs = shuffleArray([...filteredData]);
      const numSongs = Math.floor(Math.random() * (Math.min(filteredData.length, 80) - 5 + 1)) + 5;
      for (let j = 0; j < numSongs && availableSongs.length > 0; j++) {
        const song = availableSongs[j];
        playlistSongs.push(song);
        totalDuration += song.duration;
      }

      newPlaylists.push({
        name: `Play ${i + 1}`,
        songs: playlistSongs,
        totalDuration: {
          hours: Math.floor(totalDuration / 3600),
          minutes: Math.floor((totalDuration % 3600) / 60),
          seconds: totalDuration % 60,
        },
        genres: [...new Set(playlistSongs.flatMap((song) => song.genre))],
      });
    }

    setPlaylists(newPlaylists);
    localStorage.setItem("playlists", JSON.stringify(newPlaylists));
    navigate("/playlist");
  };

  return (
    <div className="w-full bg-[#F7D7D1] p-4 sm:p-6 lg:p-8 flex justify-center items-center">
      <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-6">
        
        {/* Image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <img src={CDImage} alt="CD Image" className="w-full max-w-md h-auto object-cover rounded-lg" />
        </div>

        {/* Form */}
        <div className="w-full lg:w-1/2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Theme */}
            <div>
              <label className="block mb-2 text-black font-semibold text-xl">Theme</label>
              <select
                className="w-full p-3 border rounded-md text-black text-base"
                value={filters.themes[0] || ""}
                onChange={(e) => setFilters({ ...filters, themes: e.target.value ? [e.target.value] : [] })}
              >
                {themes.map((theme, index) => (
                  <option key={index} value={theme}>{theme}</option>
                ))}
              </select>
            </div>

            {/* Genre */}
            <div>
              <label className="block mb-2 text-black font-semibold text-xl">Music Genres</label>
              <select
                className="w-full p-3 border rounded-md text-black text-base"
                value={filters.genres[0] || ""}
                onChange={(e) => setFilters({ ...filters, genres: e.target.value ? [e.target.value] : [] })}
              >
                {genres.map((genre, index) => (
                  <option key={index} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="sm:col-span-2">
              <label className="block mb-2 text-black font-semibold text-xl">Language</label>
              <select
                className="w-full p-3 border rounded-md text-black text-base"
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
              >
                {languages.map((lang, index) => (
                  <option key={index}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Artist Name */}
            <div className="sm:col-span-2">
              <label className="block mb-2 text-black font-semibold text-xl">Name of Artist</label>
              <input
                type="text"
                className="w-full p-3 border rounded-md text-black text-base"
                placeholder="Name of Artist"
                value={filters.searchTerm || ""}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 sm:col-span-2">
              <button className="bg-[#FFB2BD] text-[#8F4A56] text-base py-2 px-6 rounded-md">
                Cancel
              </button>
              <button
                className="bg-[#8F4A56] text-white text-base py-2 px-6 rounded-md"
                onClick={createPlaylists2}
              >
                Done
              </button>
            </div>

            {message && (
              <div className="text-red-600 font-bold text-center sm:col-span-2">
                {message} !!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Selector;
