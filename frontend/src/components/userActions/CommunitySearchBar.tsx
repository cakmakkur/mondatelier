import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { CommunityDto } from "../../dto/CommunityDto";
import type { PostDto } from "../../dto/PostDto";

const COMMUNITIES_PATH = import.meta.env.VITE_COMMUNITIES_PATH;
const POST_PATH = import.meta.env.VITE_POST_PATH;
const UPLOADS_PATH = import.meta.env.VITE_MEDIA_URL;

interface SearchbarProps {
  handleClickCommunity: (community: CommunityDto) => Promise<void>;
  fetchPostAndAppendItToTheTopOfTheFeed: (id: number) => Promise<void>;
}

export default function CommunitySearchBar({
  handleClickCommunity,
  fetchPostAndAppendItToTheTopOfTheFeed,
}: SearchbarProps) {
  const [query, setQuery] = useState<string>("");
  const [searchResult, setSearchResult] = useState<(CommunityDto | PostDto)[]>(
    []
  );
  const communityPageRef = useRef<number>(0);
  const postPageRef = useRef<number>(0);

  const timeoutRef = useRef<number | undefined>(undefined);

  const fetchCommunitySearchResult = async () => {
    try {
      const response = await fetch(
        `${COMMUNITIES_PATH}/search?query=${query}&page=${communityPageRef.current}`
      );
      if (response.ok) {
        const data = await response.json();
        const content = data.content;
        const newBatch = content.filter(
          (community: CommunityDto) =>
            !searchResult.some((f) => f.id === community.id)
        );
        setSearchResult((prev) => [...prev, ...newBatch]);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  const fetchPostSearchResult = async () => {
    try {
      const response = await fetch(
        `${POST_PATH}/search?query=${query}&page=${postPageRef.current}`
      );
      if (response.ok) {
        const data = await response.json();
        const content = data.content;
        const newBatch = content.filter(
          (post: PostDto) => !searchResult.some((f) => f.id === post.id)
        );
        setSearchResult((prev) => [...prev, ...newBatch]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function debounce(callback: any, delay = 500) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (...args: any) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (query === "") {
      setSearchResult([]);
      return;
    }
    const debouncedSearch = debounce(search);
    debouncedSearch();

    // reset page number when query changes
    communityPageRef.current = 0;
    postPageRef.current = 0;

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [query]);

  // fetches results after user clicks on more (results) button
  useEffect(() => {
    if (postPageRef.current > 0) {
      fetchPostSearchResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postPageRef.current]);

  useEffect(() => {
    if (communityPageRef.current > 0) {
      fetchCommunitySearchResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityPageRef.current]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const search = async () => {
    // clear search result when query changes
    setSearchResult([]);

    try {
      await fetchCommunitySearchResult();
      await fetchPostSearchResult();
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  return (
    <div className="community-search-bar-main">
      <input
        onChange={(e) => handleChange(e)}
        value={query}
        type="text"
        className="community-search-bar-input"
        placeholder="Search in communities and posts..."
      />
      <img
        className="community-search-bar-icon"
        onClick={search}
        src="/search.svg"
        alt="search button"
      />
      <div
        style={{ display: searchResult.length > 0 ? "block" : "none" }}
        className="community-search-bar-results-main"
      >
        {searchResult.map((result) => {
          // if result is a community, render a community
          if ("logoImgPath" in result) {
            return (
              <div
                key={result.id}
                className="community-search-bar-result"
                onClick={() => {
                  handleClickCommunity(result);
                  setQuery("");
                }}
              >
                <img
                  src={`${UPLOADS_PATH}${result.logoImgPath}`}
                  alt="community logo"
                />
                {result.name}
              </div>
            );
          }
          // if result is a post, render a post
          else {
            return (
              <div
                key={result.id}
                className="community-search-bar-result"
                onClick={() => {
                  fetchPostAndAppendItToTheTopOfTheFeed(result.id);
                  setQuery("");
                }}
              >
                <div className="community-search-bar-result-profile">
                  <img
                    src={`${UPLOADS_PATH}${result.profilePicturePath}`}
                    alt="profile picture"
                  />
                  {result.profileName}
                </div>
                <span className="searchbar-middledot">&#183;</span>
                <span className="community-search-bar-result-title">
                  {result.title}
                </span>
                <div className="searchbar-middledot">&#183;</div>
                <span className="community-search-bar-result-content">
                  {result.content}
                </span>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
