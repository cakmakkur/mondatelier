// BROKEN!!!!!!

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthContext } from "../auth/AuthContext";
import type { CommunityDto } from "../dto/CommunityDto.ts";
import { useModalContext } from "../context/ModalContext.tsx";
import useAxiosPrivate from "../auth/useAxiosPrivate";
import Post from "../components/community/Post.tsx";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store.ts";
import {
  addCommunity,
  clearCommunities,
} from "../store/recentCommunitiesSlice.ts";
import CommunitySearchBar from "../components/userActions/CommunitySearchBar.tsx";
import type { PostDto } from "../dto/PostDto.ts";
import CreateCommunity from "../components/userActions/CreateCommunity.tsx";

// const PROFILE_PATH = import.meta.env.VITE_PROFILE_PATH;
const POST_PATH = import.meta.env.VITE_POST_PATH;
const UPLOADS_PATH = import.meta.env.VITE_MEDIA_URL;
const COMMUNITIES_PATH = import.meta.env.VITE_COMMUNITIES_PATH;

interface FeedPageParams {
  lastCreatedAt: string;
  lastId: number;
}

type DisplayTypes = "byCommunity" | "recent" | "myFeed" | "home";

export default function Community() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuthContext();

  const dispatch = useDispatch();
  const recent = useSelector(
    (state: RootState) => state.recentCommunities.items
  );

  const { setComponentState } = useModalContext();

  const [topCommunities, setTopCommunities] = useState<CommunityDto[]>([]);
  const [myCommunities, setMyCommunities] = useState<CommunityDto[]>([]);

  const [feed, setFeed] = useState<PostDto[]>([]);
  const feedbackPageRef = useRef<FeedPageParams>({
    lastCreatedAt: "",
    lastId: 0,
  });
  const feedLoadingRef = useRef<boolean>(false);
  const [pageLoading, setPageLoading] = useState(true);
  const currentDisplayRef = useRef<DisplayTypes>("home");
  const [endOfFeed, setEndOfFeed] = useState(false);

  const [topCommunitiesExtended, setTopCommunitiesExtended] = useState(false);
  const [myCommunitiesExtended, setMyCommunitiesExtended] = useState(false);
  const [recentCommunitiesExtended, setRecentCommunitiesExtended] =
    useState(false);

  // observer and lastVisiblRef to track the threshhold dom element
  // to fetch the next batch of posts
  const observer = useRef<IntersectionObserver | null>(null);
  const lastVisibleRef = useCallback(
    (node: HTMLSpanElement | null) => {
      if (observer.current) observer.current.disconnect();

      if (!node) return;

      observer.current = new IntersectionObserver(
        async (entries) => {
          if (entries[0].isIntersecting) {
            if (
              (currentDisplayRef.current === "recent" && !endOfFeed) ||
              (currentDisplayRef.current === "myFeed" && endOfFeed)
            ) {
              await fetchRecentFeedAndPopulateFeed();
            } else if (currentDisplayRef.current === "myFeed" && !endOfFeed) {
              await fetchMyFeedAndPopulateFeed();
            }
          }
        },
        { root: null, threshold: 0.1 }
      );

      observer.current.observe(node);
    },
    [endOfFeed, feed]
  );

  // updates the communities that the user follows
  const updateMyCommunities = async (communityDto: CommunityDto) => {
    const exists = myCommunities.some((c) => c.id === communityDto.id);

    if (exists) {
      try {
        const response = await axiosPrivate.delete(
          `${COMMUNITIES_PATH}/unfollow/${communityDto.id}`
        );
        if (response.status === 204) {
          setMyCommunities((prev) =>
            prev.filter((c) => c.id !== communityDto.id)
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
          setMyCommunities((prev) => [...prev, communityDto]);
        }
      } catch (error) {
        console.error("Error following community:", error);
      }
    }
  };

  // fetches the communities that the user follows
  const fetchMyCommunities = async () => {
    if (!auth) return;
    try {
      const response = await axiosPrivate.get(`${COMMUNITIES_PATH}/me`);
      if (response.status === 200) {
        setMyCommunities(response.data);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  // clears recently visited communities from the localstorage
  const clearRecentCommunities = () => {
    dispatch(clearCommunities());
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

  // fetches a page of posts from communities that the user follows
  const fetchMyFeedAndPopulateFeed = async () => {
    if (feedLoadingRef.current || !auth) return;

    if (currentDisplayRef.current !== "myFeed") {
      feedbackPageRef.current = { lastCreatedAt: "", lastId: 0 };
      currentDisplayRef.current = "myFeed";
    } else if (feed.length > 0) {
      feedbackPageRef.current = {
        lastCreatedAt: new Date(feed[feed.length - 1].createdAt).toISOString(),
        lastId: feed[feed.length - 1].id,
      };
    }

    try {
      feedLoadingRef.current = true;
      const response = await axiosPrivate.get(
        `${POST_PATH}/from-my-communities?lastCreatedAt=${feedbackPageRef.current.lastCreatedAt}&lastId=${feedbackPageRef.current.lastId}`
      );
      if (response.status === 200) {
        const data = response.data;
        filterAndAppendToFeed(data);
      }
      if (response.status === 404) {
        setEndOfFeed(true);
        return;
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      feedLoadingRef.current = false;
    }
  };

  const fetchRecentFeedAndPopulateFeed = async () => {
    console.log("display: " + currentDisplayRef.current);
    console.log("end of feed: " + endOfFeed);

    // if (feedLoadingRef.current || endOfFeed) return;

    if (currentDisplayRef.current !== "recent") {
      feedbackPageRef.current = { lastCreatedAt: "", lastId: 0 };
      currentDisplayRef.current = "recent";
    } else if (feed.length > 0) {
      feedbackPageRef.current = {
        lastCreatedAt: new Date(feed[feed.length - 1].createdAt).toISOString(),
        lastId: feed[feed.length - 1].id,
      };
    }

    try {
      feedLoadingRef.current = true;
      const response = await fetch(
        `${POST_PATH}/recent?lastId=${feedbackPageRef.current.lastId}&lastCreatedAt=${feedbackPageRef.current.lastCreatedAt}`
      );

      if (response.status === 404) {
        setEndOfFeed(true);
        return;
      }

      const data: PostDto[] = await response.json();
      filterAndAppendToFeed(data);
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      feedLoadingRef.current = false;
    }
  };

  const initiate = async () => {
    setFeed(() => []);
    setEndOfFeed(false);
    currentDisplayRef.current = "home";

    await Promise.all([fetchTopCommunities(), fetchMyCommunities()]);
    await fetchMyFeedAndPopulateFeed();

    setPageLoading(false);
  };

  function filterAndAppendToFeed(data: PostDto[]) {
    setFeed((prev) => {
      const newBatch = data.filter(
        (post) => !prev.some((f: PostDto) => f.id === post.id)
      );
      if (newBatch.length === 0) setEndOfFeed(true);
      return [...prev, ...newBatch];
    });
  }

  useEffect(() => {
    initiate();
  }, [auth]);

  const fetchFeedByCommunityAndPopulateFeed = async (
    community: CommunityDto
  ) => {
    setEndOfFeed(false);
    feedLoadingRef.current = true;

    if (currentDisplayRef.current !== "byCommunity") {
      feedbackPageRef.current = { lastCreatedAt: "", lastId: 0 };
      currentDisplayRef.current = "byCommunity";
    } else if (feed.length > 0) {
      feedbackPageRef.current = {
        lastCreatedAt: new Date(feed[feed.length - 1].createdAt).toISOString(),
        lastId: feed[feed.length - 1].id,
      };
    }

    try {
      const response = await fetch(
        `${POST_PATH}/by-community?communityId=${community.id}&lastCreatedAt=${feedbackPageRef.current.lastCreatedAt}&lastId=${feedbackPageRef.current.lastId}`
      );
      if (response.ok) {
        const data = await response.json();
        setFeed(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      feedLoadingRef.current = false;
    }

    dispatch(addCommunity(community));
  };

  // on click on the post in search result
  // fetches the post and puts it at the top of the feed
  // finally scrolls to the top
  const handleClickPostInSearchResult = async (id: number) => {
    try {
      const response = await fetch(`${POST_PATH}/get-post/${id}`);
      if (response.ok) {
        const data = await response.json();
        // remove post from feed if already exists
        setFeed((prev) => prev.filter((f) => f.id !== data.id));
        // append new one to the top of the feed
        setFeed((prev) => [data, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // on click on the community in search result
  // fetches the community and repopulates the feed with its posts
  // finally scrolls to the top
  const handleClickCommunityInSearchResult = async (id: number) => {
    currentDisplayRef.current = "byCommunity";
    try {
      const response = await fetch(`${COMMUNITIES_PATH}/${id}`);
      if (response.ok) {
        const data = await response.json();
        await fetchFeedByCommunityAndPopulateFeed(data);
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // initiates the page again / soft reload
  const handleClickHome = () => {
    initiate();
  };

  // fetches posts that the user liked
  const handleClickLiked = () => {
    fetchMyLiked();
  };

  // fetches posts that the user liked and populates the feed
  const fetchMyLiked = async () => {
    try {
      feedLoadingRef.current = true;
      const response = await axiosPrivate.get(`${POST_PATH}/my-liked`);
      if (response.status === 200) {
        setFeed(response.data);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      feedLoadingRef.current = false;
    }
  };

  useEffect(() => {
    console.log("feed", feed);
  }, [feed]);

  // possible BROKEN!!!!!
  // resets the feed and fetches recent feed from start
  const handleClickRecentPost = async () => {
    setFeed(() => []);
    setEndOfFeed(false);

    try {
      feedbackPageRef.current = {
        lastCreatedAt: "",
        lastId: 0,
      };
      currentDisplayRef.current = "home";

      await fetchRecentFeedAndPopulateFeed();
    } catch (err) {
      console.error(err);
    }
  };

  // TODO: Loading "page"
  if (pageLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="community-main-div">
      <div className="community-main-subdiv community-main-subdiv--left">
        <div onClick={handleClickHome} className="community-home">
          <img src="/home.svg" alt="" />
          <span>Home</span>
        </div>
        <div onClick={handleClickLiked} className="community-liked">
          <img src="/heart-white.svg" alt="" />
          <span>Liked</span>
        </div>
        <div onClick={handleClickRecentPost} className="community-recent-post">
          <img src="/recent.svg" alt="" />
          <span>Recent Posts</span>
        </div>
        <div className="community-new">
          <span className="community-new-icon">+</span>
          <span
            onClick={() => setComponentState(CreateCommunity)}
            className="community-new-text"
          >
            New Community
          </span>
        </div>
        <div
          className={`sidebar-communities ${
            topCommunitiesExtended ? "sidebar-communities--extended" : ""
          }`}
        >
          <span>Top Communities</span>
          {topCommunities?.map((community) => (
            <div
              onClick={() => fetchFeedByCommunityAndPopulateFeed(community)}
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
              <div className="community-user-amount">
                {community.followerAmount < 1000
                  ? community.followerAmount
                  : community.followerAmount < 1000000
                  ? `${community.followerAmount / 1000}K`
                  : "Too Many"}{" "}
                Profiles
              </div>
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
        {recent.length > 0 && (
          <>
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
            <div
              onClick={clearRecentCommunities}
              className="delete-recent-communities"
            >
              Delete recent communities
            </div>
          </>
        )}

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
                onClick={() => setMyCommunitiesExtended(!myCommunitiesExtended)}
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
        <CommunitySearchBar
          handleClickCommunityInSearchResult={
            handleClickCommunityInSearchResult
          }
          handleClickPostInSearchResult={handleClickPostInSearchResult}
        />
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
            <span key={post.id} ref={isTrigger ? lastVisibleRef : null}>
              <Post
                post={post}
                myCommunities={myCommunities}
                updateMyCommunities={updateMyCommunities}
              />
            </span>
          );
        })}
        {endOfFeed && (
          <div>
            <button>Refresh</button>
          </div>
        )}
      </div>
      <div className="community-main-subdiv community-main-subdiv--right"></div>
    </div>
  );
}
