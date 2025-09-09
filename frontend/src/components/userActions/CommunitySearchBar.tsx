import { useState } from "react";
import type { CommunityDto } from "../../dto/CommunityDto";
import type { PostDto } from "../../dto/PostDto";

const COMMUNITIES_PATH = import.meta.env.VITE_COMMUNITIES_PATH;

export default function CommunitySearchBar() {
  const [searchResult, setSearchResult] = useState<(CommunityDto | PostDto)[]>(
    []
  );

  const search = async (query: string) => {
    try {
      const response = await fetch(
        `${COMMUNITIES_PATH}/search?query=${query}&page=${searchPage}`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResult(data);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };
  return (
    <div className="community-search-bar-main">
      <input
        type="text"
        className="community-search-bar-input"
        placeholder="Search communities and posts..."
      />
    </div>
  );
}
