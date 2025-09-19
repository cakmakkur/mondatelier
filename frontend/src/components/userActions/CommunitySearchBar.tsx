import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { CommunityDto } from "../../dto/CommunityDto";
import type { PostDto } from "../../dto/PostDto";
import { Link } from "react-router-dom";

const COMMUNITIES_PATH = import.meta.env.VITE_COMMUNITIES_PATH;
const POST_PATH = import.meta.env.VITE_POST_PATH;
const UPLOADS_PATH = import.meta.env.VITE_MEDIA_URL;

interface SearchbarProps {
  fetchPostAndAppendItToTheTopOfTheFeed: (id: number) => Promise<void>;
}

export default function CommunitySearchBar({
  fetchPostAndAppendItToTheTopOfTheFeed,
}: SearchbarProps) {
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<
    (CommunityDto | PostDto)[]
  >([]);
  const searchInProgressRef = useRef(false);
  const communityPageRef = useRef<number>(0);
  const postPageRef = useRef<number>(0);

  const timeoutRef = useRef<number | undefined>(undefined);

  const fetchCommunitySearchResult = async (): Promise<CommunityDto[]> => {
    try {
      const response = await fetch(
        `${COMMUNITIES_PATH}/search?query=${query}&page=${communityPageRef.current}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.content ?? [];
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
    return [];
  };

  const fetchPostSearchResult = async (): Promise<PostDto[]> => {
    try {
      const response = await fetch(
        `${POST_PATH}/search?query=${query}&page=${postPageRef.current}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.content ?? [];
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    return [];
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
    searchInProgressRef.current = true;

    if (query === "") {
      setSearchResults([]);
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
    try {
      const [communityResults, postResults] = await Promise.all([
        fetchCommunitySearchResult(),
        fetchPostSearchResult(),
      ]);

      const combined = [...communityResults, ...postResults];

      setSearchResults(combined);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      searchInProgressRef.current = false;
    }
  };

  const cancelSearch = () => {
    setQuery("");
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
      {query === "" ? (
        <img
          className="community-search-bar-icon"
          onClick={search}
          src="/search.svg"
          alt="search button"
        />
      ) : (
        <span onClick={cancelSearch} className="community-search-bar-x-icon">
          X
        </span>
      )}
      <div
        style={{
          display: searchResults.length > 0 ? "block" : "none",
        }}
        className="community-search-bar-results-main"
      >
        {searchResults.map((result) => {
          // if result is a community, render a community
          if ("logoImgPath" in result) {
            return (
              <Link
                to={`/community/${result.id}`}
                key={result.id + result.name}
                className="community-search-bar-result"
                onClick={() => {
                  setQuery("");
                }}
              >
                <img
                  src={`${UPLOADS_PATH}${result.logoImgPath}`}
                  alt="community logo"
                />
                {result.name}
              </Link>
            );
          }
          // if result is a post, render a post
          else if ("title" in result) {
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
      {query !== "" &&
      searchResults.length === 0 &&
      searchInProgressRef.current === false ? (
        <div className="community-search-bar-results-main">
          <div className="community-search-bar-result">Nothing found...</div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
