import type { Artwork } from "../../../dto/Artwork";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const MEDIA_URL = import.meta.env.VITE_ARTWORK_MEDIA_PATH;

export default function Visual({ artworks }: { artworks: Artwork[] }) {
  return (
    <div className="artwork_column_displayer">
      {artworks.map((artwork) => (
        <div className="artwork_column_displayer__artwork">
          <img
            className="column_artwork_image"
            src={`${BASE_URL}/${MEDIA_URL}/${artwork.id}`}
            alt="artwork image"
          />
          <div className="column_artwork_details">
            <div className="artwork_title">{artwork.title}</div>
            <div className="artwork_price">{artwork.price}</div>
            <div className="artwork_dimensions">{artwork.dimensions}</div>
            <div className="artwork_duration">{artwork.duration}</div>
            <div className="artwork_release_year">{artwork.releaseYear}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
