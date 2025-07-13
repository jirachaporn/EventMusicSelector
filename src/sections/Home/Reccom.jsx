import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";

Modal.setAppElement("#root");

const themeImages = {
  "Wedding": "./Image/wedding.jpg",
  "Night party": "./Image/Night Party.jpg",
  "Birthday party": "./Image/Birthday party.jpg",
  "Buddhist": "./Image/Buddhist.jpg",
  "Christian": "./Image/Christian.jpg",
  "Funeral": "./Image/funeral.jpg",
  "Luxury": "./Image/Luxury.jpg",
  "Graduation party": "./Image/Graduation party.jpg",
  "Christmas party": "./Image/Christmas.jpg",
  "Chinese New Year": "./Image/Chinese New Year.jpg",
  "Halloween party": "./Image/Halloween.jpg",
};

const formatDuration = (durationInSeconds) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const parseDuration = (durationStr) => {
  const parts = durationStr.split(":").map(num => {
    const parsed = parseInt(num, 10);
    return isNaN(parsed) ? 0 : parsed;
  });

  let seconds = 0;
  if (parts.length === 3) {
    seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    seconds = parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    seconds = parts[0];
  }
  return seconds;
};

const SongGrid = ({ songs }) => (
  <div className="grid grid-cols-1 gap-4 mt-5">
    {songs.map((song, idx) => (
      <div key={idx} className="p-4 bg-gray-100 rounded-lg shadow-md flex flex-col lg:flex-row items-center lg:items-start">
        <div className="w-full lg:w-1/2">
          <iframe
            width="100%"
            height="200"
            src={song.youtubeId ? song.youtubeId.replace("watch?v=", "embed/") : ""}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={song.songName}
          ></iframe>
        </div>

        <div className="w-full lg:w-1/2 pl-0 lg:pl-4 mt-4 lg:mt-0 flex flex-col justify-between">
          <div className="text-lg font-semibold text-gray-800 flex justify-between items-center">
            <strong>{song.songName}</strong>
            <span className="text-sm text-gray-600">{formatDuration(song.duration)}</span>
          </div>
          <div className="text-sm text-gray-500">{song.artist}</div>

          {song.url && song.url !== "#" && (
            <iframe
              src={song.url}
              className="rounded-md w-full mt-3"
              allow="autoplay"
              title="Song Player"
            ></iframe>
          )}
        </div>
      </div>
    ))}
  </div>
);

const ThemeCard = ({ theme, image, onClick }) => (
  <div
    className="bg-white border border-gray-300 rounded-lg p-4 cursor-pointer w-full h-96 flex flex-col justify-between relative"
    onClick={onClick}
  >
    <img
      src={image || "/Image/default.jpg"}
      alt={theme}
      className="w-full h-72 object-cover rounded-md"
    />
    <h3 className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-xl text-black font-semibold text-center">
      {theme}
    </h3>
  </div>
);

function Reccom() {
  const [songs, setSongs] = useState([]);
  const [groupedByTheme, setGroupedByTheme] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [error, setError] = useState(null);

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
              genre: song["ประเภทเพลง"]
                ? song["ประเภทเพลง"].split(",").map(g => g.trim()).filter(g => g !== "")
                : [],
              theme: song["ธีมงาน"]
                ? song["ธีมงาน"].split(",").map(t => t.trim()).filter(t => t !== "")
                : [],
              language: song["ภาษา"] || "Unknown",
              youtubeId: song["ลิ้ง url"] || "",
              url: song["song url"] || "", // in case there's another audio source
            }));

            setSongs(modifiedSongs);

            const themes = modifiedSongs.reduce((acc, song) => {
              song.theme.forEach((t) => {
                if (!acc[t]) acc[t] = [];
                acc[t].push(song);
              });
              return acc;
            }, {});

            setGroupedByTheme(themes);
          },
        });
      } catch (error) {
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูลเพลง");
        console.error("Error loading CSV:", error);
      }
    };

    fetchData();
  }, []);

  const openModal = (theme) => {
    setSelectedTheme(theme);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTheme(null);
  };

  const getRandomSongs = (songsList, min = 10, max = 15) => {
    const numberOfSongs = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffledSongs = [...songsList].sort(() => Math.random() - 0.5);
    return shuffledSongs.slice(0, numberOfSongs);
  };

  const selectedThemeSongs = groupedByTheme[selectedTheme] || [];
  const randomSongs = getRandomSongs(selectedThemeSongs, 10, 15);
  const totalDuration = randomSongs.reduce((acc, song) => acc + song.duration, 0);

  return (
    <div className="bg-[#F7D7D1] p-4 sm:p-6 md:p-8">
      <h1 className="text-black text-2xl sm:text-3xl font-bold mb-5">Recommended</h1>

      {error && <div className="text-red-500 font-bold">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative">
        {Object.keys(groupedByTheme).map((theme, index) => (
          <ThemeCard
            key={index}
            theme={theme}
            image={themeImages[theme]}
            onClick={() => openModal(theme)}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Songs in Theme"
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
          content: {
            width: "90%",
            maxWidth: "900px",
            maxHeight: "80vh",
            margin: "auto",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            overflowY: "auto",
            marginTop: "80px",
            color: "black",
          },
        }}
      >
        <div className="flex justify-end items-center">
          <button onClick={closeModal}>
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row items-center mt-2 mx-4 lg:mx-10">
          <img
            src={themeImages[selectedTheme] || "/Image/default.jpg"}
            alt={selectedTheme}
            className="w-full max-w-xs h-40 object-cover mb-4 lg:mb-0 lg:mr-5 rounded-md"
          />
          <div className="text-lg text-center lg:text-left">
            <p><strong className="text-2xl">{selectedTheme}</strong></p>
            <p><strong>ระยะเวลารวม:</strong> {formatDuration(totalDuration)}</p>
            <p><strong>แนวเพลง:</strong> {randomSongs.length > 0 ? randomSongs[0].genre.join(", ") : "ไม่มีข้อมูล"}</p>
            <p><strong>จำนวนเพลง:</strong> {randomSongs.length}</p>
          </div>
        </div>

        <SongGrid songs={randomSongs} />
      </Modal>
    </div>
  );
}

export default Reccom;
