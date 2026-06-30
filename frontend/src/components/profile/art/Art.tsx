import { useEffect, useState } from "react";
import Visual from "./Visual";
import Audible from "./Audible";
import Watchable from "./Watchable";
import Readable from "./Readable";
import type { Artwork } from "../../../dto/Artwork";
import type { CategoryMedia } from "../../../dto/CategoryMedia";
import { useParams } from "react-router-dom";

const ART_URL = import.meta.env.VITE_ARTWORK_PATH;

// springboot page returns:

// {
//   "content": [ ... ],
//   "totalPages": 5,
//   "totalElements": 50,
//   ...
// }

export default function Art() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categoryMedia, setCategoryMedia] = useState<CategoryMedia[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<null | string>(null);

  const { profileId } = useParams();
  const [page] = useState(0);
  const [size] = useState(10);
  const [sortBy] = useState("createdAt");

  const extractCategories = (data: Artwork[]) => {
    const map = new Map<string, string>();

    data.forEach((artwork) => {
      if (!map.has(artwork.artCategory)) {
        map.set(artwork.artCategory, artwork.mediaType);
      }
    });

    const categoriesArray: CategoryMedia[] = Array.from(
      map,
      ([category, mediaType]) => ({
        category,
        mediaType,
      })
    );

    setCategoryMedia(categoriesArray);
  };

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    async function fetchArtworks() {
      try {
        const response = await fetch(
          `${ART_URL}?profileId=${profileId}&page=${page}&size=${size}&sortBy=${sortBy}`
        );
        if (!response.ok) throw new Error("Failed to fetch artworks");
        const data = await response.json();
        if (data.content.length === 0) {
          return;
        }
        setArtworks(data.content);
        extractCategories(data.content);
        setSelectedCategory(data.content[0].artCategory);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    }

    fetchArtworks();
  }, [page, profileId, size, sortBy]);

  return (
    <div>
      <div className="types_container">
        {categoryMedia.map((categoryMedia, index) => (
          <div
            onClick={() => selectCategory(categoryMedia.category)}
            key={categoryMedia.category}
            className={`art_type art_type_${index + 1} ${
              selectedCategory === categoryMedia.category
                ? "art_type--selected"
                : ""
            }`}
          >
            <span>{categoryMedia.category}</span>
          </div>
        ))}
      </div>
      <div>
        {selectedCategory === null
          ? null
          : (() => {
              const currentCategoryMedia = categoryMedia.find(
                (cm) => cm.category === selectedCategory
              );

              if (!currentCategoryMedia) return <p>Category not found.</p>;

              switch (currentCategoryMedia.mediaType) {
                case "visual":
                  return (
                    <Visual
                      artworks={artworks.filter(
                        (artwork) => artwork.artCategory === selectedCategory
                      )}
                    />
                  );
                case "audible":
                  return (
                    <Audible
                      artworks={artworks.filter(
                        (artwork) => artwork.artCategory === selectedCategory
                      )}
                    />
                  );
                case "watchable":
                  return (
                    <Watchable
                      artworks={artworks.filter(
                        (artwork) => artwork.artCategory === selectedCategory
                      )}
                    />
                  );
                case "readable":
                  return (
                    <Readable
                      artworks={artworks.filter(
                        (artwork) => artwork.artCategory === selectedCategory
                      )}
                    />
                  );
                default:
                  return <div> Unknown media type</div>;
              }
            })()}
      </div>
    </div>
  );
}
