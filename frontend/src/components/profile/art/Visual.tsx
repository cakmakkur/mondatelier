import { useState } from "react";
import type { Artwork } from "../../../dto/Artwork";
import formatPrice from "../../../util/formatPrice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const MEDIA_URL = import.meta.env.VITE_ARTWORK_MEDIA_PATH;

export default function Visual({ artworks }: { artworks: Artwork[] }) {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="artwork_column_displayer">
      {artworks.map((a) => (
        <div className="artwork_column_displayer__artwork" key={a.id}>
          {/* {!loadedImages[a.id] && (
            <div className="artwork_loading">
              <div className="artwork_loading1"></div>
            </div>
          )} */}

          <img
            className={`column_artwork_image ${
              loadedImages[a.id] ? "profil__img--active" : "hidden"
            }`}
            src={`${BASE_URL}/${MEDIA_URL}/${a.id}`}
            alt="artwork image"
            onLoad={() => handleImageLoad(a.id)}
          />

          <div className="column_artwork_details">
            <div className="artwork_title">{a.title}</div>
            <div className="artwork_dimensions">{a.dimensions}</div>
            <div className="artwork_release_year">{a.releaseYear}</div>
            <div className="artwork_price">{formatPrice(a.price)}</div>
            <div className="art_label_box">
              <div className="art_label">Absdfsd</div>
              <div className="art_label">Abstract Impression</div>
              <div className="art_label">SDNjn sdlfk</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
