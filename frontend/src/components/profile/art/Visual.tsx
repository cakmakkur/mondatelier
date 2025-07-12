import type { Artwork } from "../../../dto/Artwork";
import formatPrice from "../../../util/formatPrice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const MEDIA_URL = import.meta.env.VITE_ARTWORK_MEDIA_PATH;

export default function Visual({ artworks }: { artworks: Artwork[] }) {
  console.log(artworks);
  return (
    <div className="artwork_column_displayer">
      {artworks.map((a) => (
        <div className="artwork_column_displayer__artwork">
          <img
            className="column_artwork_image"
            src={`${BASE_URL}/${MEDIA_URL}/${a.id}`}
            alt="artwork image"
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
