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

const POST_PATH = import.meta.env.VITE_POST_PATH;
const UPLOADS_PATH = import.meta.env.VITE_MEDIA_URL;
const COMMUNITIES_PATH = import.meta.env.VITE_COMMUNITIES_PATH;

interface FeedPageParams {
  lastCreatedAt: string;
  lastId: number;
}

type FeedTypes = "byCommunity" | "recent" | "myFeed" | "default";

export default function Community() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuthContext();

  const { setComponentState } = useModalContext();

  const dispatch = useDispatch();
  const recent = useSelector(
    (state: RootState) => state.recentCommunities.items
  );

  const [topCommunities, setTopCommunities] = useState<CommunityDto[]>([]);
  const [myCommunities, setMyCommunities] = useState<CommunityDto[]>([]);

  const [feed, setFeed] = useState<PostDto[]>([]);
  const feedPageRef = useRef<FeedPageParams>({
    lastCreatedAt: "",
    lastId: 0,
  });
  const [pageLoading, setPageLoading] = useState(true);
  const feedLoadingRef = useRef<boolean>(false);

  const feedTypeRef = useRef<FeedTypes>("default");

  const [endOfFeed, setEndOfFeed] = useState(false);
  const endOfFeedRef = useRef(false);

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
              (feedTypeRef.current === "recent" && !endOfFeedRef.current) ||
              (feedTypeRef.current === "myFeed" && endOfFeedRef.current)
            ) {
              await fetchRecentFeedAndPopulateFeed();
            } else if (
              feedTypeRef.current === "myFeed" &&
              !endOfFeedRef.current
            ) {
              await fetchMyFeedAndPopulateFeed();
            }
          }
        },
        { root: null, threshold: 0.1 }
      );

      observer.current.observe(node);
    },
    [feed, endOfFeed]
  );

  // updates the communities that the user follows
  const updateMyCommunities = async (communityDto: CommunityDto) => {
    const exists = myCommunities.some((c) => c.id === communityDto.id);

    if (exists) {
      try {
        await axiosPrivate.delete(
          `${COMMUNITIES_PATH}/unfollow/${communityDto.id}`
        );
        setMyCommunities((prev) =>
          prev.filter((c) => c.id !== communityDto.id)
        );
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
      setMyCommunities(response.data);
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
    feedLoadingRef.current = true;

    if (feedTypeRef.current !== "myFeed") {
      feedPageRef.current = { lastCreatedAt: "", lastId: 0 };
      feedTypeRef.current = "myFeed";
      endOfFeedRef.current = false;
      setEndOfFeed(false);
      window.scrollTo(0, 0);
      setFeed(() => []);
    } else if (feed.length > 0 && !endOfFeedRef.current) {
      feedPageRef.current = {
        lastCreatedAt: new Date(feed[feed.length - 1].createdAt).toISOString(),
        lastId: feed[feed.length - 1].id,
      };
    }
    try {
      const response = await axiosPrivate.get(
        `${POST_PATH}/from-my-communities?lastCreatedAt=${feedPageRef.current.lastCreatedAt}&lastId=${feedPageRef.current.lastId}`
      );

      const data = response.data;
      filterAndAppendToFeed(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === 404) {
        setEndOfFeed(true);
        endOfFeedRef.current = true;
        // TODO: starting from here, implement fetching of recent posts
        // at this point there is no new post from communities
        return;
      }
      console.error("Error fetching feed:", error);
    } finally {
      feedLoadingRef.current = false;
    }
  };

  const fetchRecentFeedAndPopulateFeed = async () => {
    if (feedLoadingRef.current) return;
    feedLoadingRef.current = true;

    if (feedTypeRef.current === "myFeed" && endOfFeedRef.current) {
      feedTypeRef.current = "recent";
      endOfFeedRef.current = false;
      setEndOfFeed(false);
    } else if (feedTypeRef.current !== "recent") {
      feedPageRef.current = { lastCreatedAt: "", lastId: 0 };
      feedTypeRef.current = "recent";
      endOfFeedRef.current = false;
      setEndOfFeed(false);
      setFeed(() => []);
      window.scrollTo(0, 0);
    } else if (feed.length > 0 && !endOfFeedRef.current) {
      feedPageRef.current = {
        lastCreatedAt: new Date(feed[feed.length - 1].createdAt).toISOString(),
        lastId: feed[feed.length - 1].id,
      };
    }
    try {
      const response = await fetch(
        `${POST_PATH}/recent?lastId=${feedPageRef.current.lastId}&lastCreatedAt=${feedPageRef.current.lastCreatedAt}`
      );

      if (response.status === 404) {
        setEndOfFeed(true);
        endOfFeedRef.current = true;
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

  const filterAndAppendToFeed = (data: PostDto[]) => {
    setFeed((prev) => {
      const newData = data.filter(
        (post) => !prev.some((f: PostDto) => f.id === post.id)
      );
      if (newData.length === 0) setEndOfFeed(true);
      return [...prev, ...newData];
    });
  };

  const fetchFeedByCommunityAndPopulateFeed = async (
    community: CommunityDto
  ) => {
    if (feedLoadingRef.current) return;
    feedLoadingRef.current = true;

    if (feedTypeRef.current !== "byCommunity") {
      feedPageRef.current = { lastCreatedAt: "", lastId: 0 };
      feedTypeRef.current = "byCommunity";
      endOfFeedRef.current = false;
      setEndOfFeed(false);
      window.scrollTo(0, 0);
      setFeed(() => []);
    } else if (feed.length > 0 && !endOfFeedRef.current) {
      feedPageRef.current = {
        lastCreatedAt: new Date(feed[feed.length - 1].createdAt).toISOString(),
        lastId: feed[feed.length - 1].id,
      };
    }

    try {
      const response = await fetch(
        `${POST_PATH}/by-community?communityId=${community.id}&lastCreatedAt=${feedPageRef.current.lastCreatedAt}&lastId=${feedPageRef.current.lastId}`
      );

      if (response.status === 404) {
        setEndOfFeed(true);
        endOfFeedRef.current = true;
        return;
      }

      const data = await response.json();
      filterAndAppendToFeed(data);
    } catch (err) {
      console.error(err);
    } finally {
      feedLoadingRef.current = false;
    }

    // at it to recent communities (localstorage) of the user
    dispatch(addCommunity(community));
  };

  // on click on the post in search result
  // fetches the post and puts it at the top of the feed
  // finally scrolls to the top
  const fetchPostAndAppendItToTheTopOfTheFeed = async (id: number) => {
    try {
      const response = await fetch(`${POST_PATH}/get-post/${id}`);
      const data = await response.json();
      // remove post from feed if already exists
      setFeed((prev) => prev.filter((f) => f.id !== data.id));
      // append new one to the top of the feed
      setFeed((prev) => [data, ...prev]);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
    }
  };

  // fetches posts that the user liked
  const handleClickLiked = () => {
    fetchMyLiked();
  };

  // TODO: need to implement in BE
  // fetches posts that the user liked and populates the feed
  const fetchMyLiked = async () => {
    try {
      feedLoadingRef.current = true;
      const response = await axiosPrivate.get(`${POST_PATH}/my-liked`);
      setFeed(response.data);
    } catch (err) {
      console.warn(err);
    } finally {
      feedLoadingRef.current = false;
    }
  };

  // resets the feed and fetches recent feed from start
  const handleClickRecentPosts = async () => {
    feedTypeRef.current = "default"; // resets the page and feed
    try {
      await fetchRecentFeedAndPopulateFeed();
    } catch (err) {
      console.error(err);
    }
  };

  // resets the feed and fetches posts from given community from the start
  const handleClickCommunity = async (community: CommunityDto) => {
    feedTypeRef.current = "default"; // resets the page and feed
    try {
      await fetchFeedByCommunityAndPopulateFeed(community);
    } catch (err) {
      console.error(err);
    }
  };

  const initiate = async () => {
    // reset block for usages after the initial load, ensure that variables are reset
    setFeed(() => []);
    setEndOfFeed(false);
    endOfFeedRef.current = false;
    feedTypeRef.current = "default";
    feedPageRef.current = { lastCreatedAt: "", lastId: 0 };

    // fetch top communities and users communities if authenticated
    await Promise.all([fetchTopCommunities(), fetchMyCommunities()]);

    // depending on authentication, fetch recent or personalised feed
    if (auth) {
      await fetchMyFeedAndPopulateFeed();
    } else {
      await fetchRecentFeedAndPopulateFeed();
    }

    setPageLoading(false);
  };

  useEffect(() => {
    initiate();
  }, [auth]);

  // TODO: Proper loading "page"
  if (pageLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="community-main-div">
      <div className="community-main-subdiv community-main-subdiv--left">
        <div onClick={initiate} className="community-home">
          <img src="/home.svg" alt="" />
          <span>Home</span>
        </div>
        <div onClick={handleClickRecentPosts} className="community-recent-post">
          <img src="/recent.svg" alt="" />
          <span>Recent Posts</span>
        </div>
        <div onClick={handleClickLiked} className="community-liked">
          <img src="/heart.svg" alt="" />
          <span>Liked</span>
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
          <span className="sidebar-communities-title">Top Communities</span>
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
              <span className="sidebar-communities-title">
                Recent Communities
              </span>
              {recent.map((community) => (
                <div
                  onClick={() => handleClickCommunity(community)}
                  className="sidebar-community"
                  key={community.id}
                >
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
            <span className="sidebar-communities-title"> My Communities</span>
            {myCommunities?.map((community) => (
              <div
                onClick={() => handleClickCommunity(community)}
                className="sidebar-community"
                key={community.id}
              >
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
          handleClickCommunity={handleClickCommunity}
          fetchPostAndAppendItToTheTopOfTheFeed={
            fetchPostAndAppendItToTheTopOfTheFeed
          }
        />
        {feed?.map((post, i) => {
          let isTrigger = false;

          if (feed.length >= 5 && !endOfFeedRef.current) {
            if (i === feed.length - 5) {
              isTrigger = true;
            }
          } else if (i === feed.length - 1 && !endOfFeedRef.current) {
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
