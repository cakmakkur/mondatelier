import { useState } from "react";
import type { Artwork } from "../../../dto/Artwork";
import Track from "./Track";

export default function Audible({ artworks }: { artworks: Artwork[] }) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlayExclusive = (id: string) => {
    setPlayingId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="audible_main_div">
      <ul className="audible_main_div_list">
        {artworks.map((track) => (
          <Track
            key={track.id}
            data={track}
            onPlayExclusive={handlePlayExclusive}
            isPlaying={track.id === playingId}
          />
        ))}
      </ul>
    </div>
  );
}
