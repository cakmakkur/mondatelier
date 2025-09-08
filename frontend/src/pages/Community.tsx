import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthContext } from "../auth/AuthContext";
import type { CommunityDto } from "../dto/CommunityDto.ts";
import type { PostDto } from "../dto/PostDto.ts";
import { useModalContext } from "../context/ModalContext.tsx";
import useAxiosPrivate from "../auth/useAxiosPrivate";
import Post from "../components/community/Post.tsx";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store.ts";
import { addCommunity } from "../store/recentCommunitiesSlice.ts";
import CommunitySearchBar from "../components/userActions/CommunitySearchBar.tsx";

// const PROFILE_PATH = import.meta.env.VITE_PROFILE_PATH;
const POST_PATH = import.meta.env.VITE_POST_PATH;
const UPLOADS_PATH = import.meta.env.VITE_MEDIA_URL;
const COMMUNITIES_PATH = import.meta.env.VITE_COMMUNITIES_PATH;

interface FeedPageParams {
  lastCreatedAt: string;
  lastId: number | null;
}

export default function Community() {
  const axiosPrivate = useAxiosPrivate();

  const { auth } = useAuthContext();
  const { setComponentState } = useModalContext();

  const [recentCommunities, setRecentCommunities] = useState<
    [CommunityDto] | null
  >(null);
  const [topCommunities, setTopCommunities] = useState<CommunityDto[]>([]);
  const [feed, setFeed] = useState<PostDto[]>([]);
  const [myCommunities, setMyCommunities] = useState<CommunityDto[]>([]);
  const [searchResult, setSearchResult] = useState<(CommunityDto | PostDto)[]>(
    []
  );
  const [feedPage, setFeedPage] = useState<FeedPageParams>({
    lastCreatedAt: new Date().toISOString(),
    lastId: null,
  });

  const [searchPage, setSearchPage] = useState(1);

  const topCommunitiesRef = useRef<HTMLDivElement>(null);
  const myCommunitiesRef = useRef<HTMLDivElement>(null);
  const recentCommunitiesRef = useRef<HTMLDivElement>(null);

  const [topCommunitiesExtended, setTopCommunitiesExtended] = useState(false);
  const [myCommunitiesExtended, setMyCommunitiesExtended] = useState(false);
  const [recentCommunitiesExtended, setRecentCommunitiesExtended] =
    useState(false);

  const dispatch = useDispatch();
  const recent = useSelector(
    (state: RootState) => state.recentCommunities.items
  );

  const observer = useRef<IntersectionObserver | null>(null);

  const lastVisibleRef = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node: any) => {
      if (observer.current) observer.current.disconnect();

      if (!node) return;

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchRecentFeed();
          }
        },
        { root: null, threshold: 0.1 }
      );

      observer.current.observe(node);
    },
    []
  );

  const updateMyCommunities = async (communityDto: CommunityDto) => {
    const exists = myCommunities.some((c) => c.id === communityDto.id);

    if (exists) {
      try {
        const response = await axiosPrivate.delete(
          `${COMMUNITIES_PATH}/unfollow/${communityDto.id}`
        );
        if (response.status === 204) {
          setMyCommunities(
            myCommunities.filter((c) => c.id !== communityDto.id)
          );
        }
      } catch (error) {
        console.error("Error unfollowing community:", error);
      }
    } else {
      try {
        const response = await axiosPrivate.post(
          `${COMMUNITIES_PATH}/follow/${communityDto.id}`
        );
        if (response.status === 200) {
          setMyCommunities([...myCommunities, communityDto]);
        }
      } catch (error) {
        console.error("Error following community:", error);
      }
    }
  };

  const fetchMyCommunities = async () => {
    if (auth) {
      try {
        const response = await axiosPrivate.get(`${COMMUNITIES_PATH}/me`);
        if (response.status === 200) {
          setMyCommunities(response.data);
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    }
  };

  const getRecentCommunities = () => {
    const recentCommunities = localStorage.getItem("recentCommunities");
    if (recentCommunities) {
      setRecentCommunities(JSON.parse(recentCommunities));
    }
  };

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

  const clearRecentCommunities = () => {
    localStorage.removeItem("recentCommunities");
  };

  const fetchTopCommunities = async () => {
    try {
      const response = await fetch(`${COMMUNITIES_PATH}/top`);
      if (response.ok) {
        const data = await response.json();
        setTopCommunities(data);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  const fetchMyFeed = async () => {
    if (!auth) return;
    try {
      const response = await axiosPrivate.get(`${POST_PATH}/me`);
      if (response.status === 200) {
        const data = await response.data;
        setFeed((prev) => [...prev, ...data]);
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  const fetchRecentFeed = async () => {
    try {
      const response = await fetch(
        `${POST_PATH}/recent?lastCreatedAt=${feedPage.lastCreatedAt}${
          feedPage.lastId ? `&lastId=${feedPage.lastId}` : ""
        }`
      );
      if (response.ok) {
        const data = await response.json();
        setFeed((prev) => [...prev, ...data]);
        if (data.length > 0) {
          setFeedPage({
            lastCreatedAt: data[data.length - 1].createdAt,
            lastId: data[data.length - 1].id,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  const initiate = () => {
    fetchTopCommunities();
    fetchMyCommunities();
    getRecentCommunities();
    fetchMyFeed();
  };

  useEffect(() => {
    initiate();
  }, [auth]);

  const handleClickCommunity = (community: CommunityDto) => {
    // fetch posts from that community
    dispatch(addCommunity(community));
  };

  const handleClickHome = () => {
    initiate();
  };

  return (
    <div className="community-main-div">
      <div className="community-main-subdiv community-main-subdiv--left">
        <div onClick={handleClickHome} className="community-home">
          <img src="/home.svg" alt="" />
          <span>Home</span>
        </div>
        <div onClick={handleClickHome} className="community-home">
          <img src="/heart-white.svg" alt="" />
          <span>Liked</span>
        </div>
        <div onClick={handleClickHome} className="community-home">
          <img src="/recent.svg" alt="" />
          <span>Recent Post</span>
        </div>
        <div className="community-new">
          <span className="community-new-icon">+</span>
          <span className="community-new-text">New Community</span>
        </div>
        <div
          className={`sidebar-communities ${
            topCommunitiesExtended ? "sidebar-communities--extended" : ""
          }`}
        >
          <span>Top Communities</span>
          {topCommunities?.map((community) => (
            <div
              onClick={() => handleClickCommunity(community)}
              className="sidebar-community"
              key={community.id}
            >
              <img
                src={`${UPLOADS_PATH}${community.logoImgPath}`}
                alt="community thumbnail"
              />
              <div className="community-name-container">
                <div className="community-name">{community.name}</div>
              </div>
              <div className="community-user-amount">103 Profiles</div>
            </div>
          ))}
          {topCommunities.length > 3 && (
            <div
              onClick={() => {
                setTopCommunitiesExtended(!topCommunitiesExtended);
              }}
              className={`sidebar-community-accordeon-button ${
                topCommunitiesExtended
                  ? "sidebar-community-accordeon-button--up"
                  : ""
              }`}
            >
              <img src="/down.svg" alt="" />
            </div>
          )}
        </div>

        <div
          className={`sidebar-communities ${
            recentCommunitiesExtended ? "sidebar-communities--extended" : ""
          }`}
        >
          <span>Recent Communities</span>
          {recent.map((community) => (
            <div className="sidebar-community" key={community.id}>
              <img
                src={`${UPLOADS_PATH}${community.logoImgPath}`}
                alt="community thumbnail"
              />
              <div className="community-name">{community.name}</div>
            </div>
          ))}
          {recent.length > 3 && (
            <div
              onClick={() => {
                setRecentCommunitiesExtended(!recentCommunitiesExtended);
              }}
              className={`sidebar-community-accordeon-button ${
                recentCommunitiesExtended
                  ? "sidebar-community-accordeon-button--up"
                  : ""
              }`}
            >
              <img src="/down.svg" alt="" />
            </div>
          )}
        </div>

        {auth && (
          <div
            className={`sidebar-communities ${
              myCommunitiesExtended ? "sidebar-communities--extended" : ""
            }`}
          >
            <span> My Communities</span>
            {myCommunities?.map((community) => (
              <div className="sidebar-community" key={community.id}>
                <img
                  src={`${UPLOADS_PATH}${community.logoImgPath}`}
                  alt="community thumbnail"
                />
                <div className="community-name">{community.name}</div>
              </div>
            ))}
            {myCommunities.length > 3 && (
              <div
                className={`sidebar-community-accordeon-button ${
                  myCommunitiesExtended
                    ? "sidebar-community-accordeon-button--up"
                    : ""
                }`}
              >
                <img src="/down.svg" alt="" />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="community-main-subdiv community-main-subdiv--center">
        <CommunitySearchBar />
        {feed?.map((post, i) => {
          let isTrigger = false;

          if (feed.length >= 5) {
            if (i === feed.length - 5) {
              isTrigger = true;
            }
          } else if (i === feed.length - 1) {
            isTrigger = true;
          }

          return (
            <span ref={isTrigger ? lastVisibleRef : null}>
              <Post
                post={post}
                myCommunities={myCommunities}
                updateMyCommunities={updateMyCommunities}
                key={i}
              />
            </span>
          );
        })}
      </div>
      <div className="community-main-subdiv community-main-subdiv--right"></div>
    </div>
  );
}
