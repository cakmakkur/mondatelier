import { useState } from "react";
import type { Artwork } from "../../../dto/Artwork";
import formatPrice from "../../../util/formatPrice";
import useAxiosPrivate from "../../../auth/useAxiosPrivate";

const UPLOADS_URL = import.meta.env.VITE_MEDIA_URL;
const ARTWORK_PATH = import.meta.env.VITE_ARTWORK_PATH;

export default function Visual({ artworks }: { artworks: Artwork[] }) {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const axiosPrivate = useAxiosPrivate();

  const handleLikeClick = async (id: string) => {
    try {
      const response = await axiosPrivate.post(`${ARTWORK_PATH}/like/${id}`);
      if (response.status === 200) {
        console.log("liked");
        return response.data;
      } else {
        // handle error
      }
    } catch (error) {
      console.error(error);
      // handle error
    }
  };

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
            src={`${UPLOADS_URL}${a.medias.find((m) => m.isThumbnail)?.path}`}
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
            <div>
              <img
                onClick={() => handleLikeClick(a.id)}
                className="art_meta_like"
                src="/thumb_up.svg"
                alt=""
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
