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
  lastId: number | null;
}

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
    lastId: null,
  });
  const feedLoadingRef = useRef<boolean>(false);
  const endOfFeedRef = useRef<boolean>(false);

  const [topCommunitiesExtended, setTopCommunitiesExtended] = useState(false);
  const [myCommunitiesExtended, setMyCommunitiesExtended] = useState(false);
  const [recentCommunitiesExtended, setRecentCommunitiesExtended] =
    useState(false);

  // observer and lastVisiblRef to track the threshhold dom element
  // to fetch the next batch of posts
  const observer = useRef<IntersectionObserver | null>(null);
  const lastVisibleRef = useCallback((node: HTMLSpanElement | null) => {
    if (observer.current) observer.current.disconnect();

    if (!node) return;

    observer.current = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          await fetchRecentFeedAndPopulateFeed();
        }
      },
      { root: null, threshold: 0.1 }
    );

    observer.current.observe(node);
  }, []);

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

  // fetches most recent 25 posts of the user's communities
  const fetchMyFeed = async () => {
    if (feedLoadingRef.current) return;
    if (!auth) return;
    try {
      feedLoadingRef.current = true;
      const response = await axiosPrivate.get(`${POST_PATH}/me`);
      if (response.status === 200) {
        const data = await response.data;
        if (data.length > 0) {
          const newBatch = data.filter(
            (post: PostDto) => !feed.some((f) => f.id === post.id)
          );
          setFeed((prev) => [...prev, ...newBatch]);
        }
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      feedLoadingRef.current = false;
    }
  };

  const fetchRecentFeedAndPopulateFeed = async () => {
    if (feedLoadingRef.current) return;

    // end of feed flag to stop fetching next batch until page reload
    if (endOfFeedRef.current) return;

    try {
      feedLoadingRef.current = true;
      const response = await fetch(
        `${POST_PATH}/recent?lastCreatedAt=${
          feedbackPageRef.current.lastCreatedAt
        }${
          feedbackPageRef.current.lastId
            ? `&lastId=${feedbackPageRef.current.lastId}`
            : ""
        }`
      );

      if (response.status === 404) return (endOfFeedRef.current = true);

      const data: PostDto[] = await response.json();
      if (data.length === 0) return;

      setFeed((prev) => {
        // filter out posts that are already in the feed
        const newBatch = data.filter(
          (post) => !prev.some((f) => f.id === post.id)
        );

        if (newBatch.length === 0) {
          // sets endOfFeed flag up so that it doesn't try to fetch next batch
          // of posts without a (page?) refresh
          endOfFeedRef.current = true;
          return prev;
        }

        // update pagination parameters using the actual new batch
        feedbackPageRef.current = {
          lastCreatedAt: new Date(
            newBatch[newBatch.length - 1].createdAt
          ).toISOString(),
          lastId: newBatch[newBatch.length - 1].id,
        };

        return [...prev, ...newBatch];
      });
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      feedLoadingRef.current = false;
    }
  };

  const initiate = async () => {
    setFeed([]);

    // fetches the communities with most followers
    fetchTopCommunities();
    // fetches user's communities if auth !== undefined
    fetchMyCommunities();
    // retrieves recently viewed communities only from localstorage

    // try-catch ensures that myFeed comes first in the feed, recent comes afterwards.
    try {
      // fetches users feed based on followed communities
      await fetchMyFeed();
    } catch (err) {
      console.warn(err);
    } finally {
      try {
        // fetches recent feed based on date of creation
        await fetchRecentFeedAndPopulateFeed();
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // initiates the page
  useEffect(() => {
    initiate();
  }, [auth]);

  const populateWithPostsByCOmmunity = async (community: CommunityDto) => {
    endOfFeedRef.current = false;
    feedLoadingRef.current = true;
    feedbackPageRef.current = {
      lastCreatedAt: "",
      lastId: null,
    };

    try {
      const response = await fetch(`${POST_PATH}/by-community/${community.id}`);
      if (response.ok) {
        const data = await response.json();
        setFeed(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      feedLoadingRef.current = false;
    }

    // add it to recent communities
    dispatch(addCommunity(community));
  };

  const handleClickPostInSearchResult = async (id: number) => {
    try {
      const response = await fetch(`${POST_PATH}/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFeed([data, ...feed]);
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // on click on the community in search result
  // fetches the community and repopulates the feed with its posts
  const handleClickCommunityInSearchResult = async (id: number) => {
    try {
      const response = await fetch(`${COMMUNITIES_PATH}/${id}`);
      if (response.ok) {
        const data = await response.json();
        await populateWithPostsByCOmmunity(data);
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // initiates the page again / soft reload
  const handleClickHome = () => {
    endOfFeedRef.current = false;
    feedbackPageRef.current = {
      lastCreatedAt: "",
      lastId: null,
    };
    initiate();
  };

  // fetches posts that the user liked
  const handleClickLiked = () => {
    fetchMyLiked();
  };

  const fetchMyLiked = async () => {
    endOfFeedRef.current = false;
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

  // resets the feed and fetches recent feed from start
  const handleClickRecentPost = async () => {
    try {
      endOfFeedRef.current = false;
      setFeed([]);
      feedbackPageRef.current = {
        lastCreatedAt: "",
        lastId: null,
      };
      await fetchRecentFeedAndPopulateFeed();
    } catch (err) {
      console.error(err);
    }
  };

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
          <span>Recent Post</span>
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
              onClick={() => populateWithPostsByCOmmunity(community)}
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
      </div>
      <div className="community-main-subdiv community-main-subdiv--right"></div>
    </div>
  );
}
