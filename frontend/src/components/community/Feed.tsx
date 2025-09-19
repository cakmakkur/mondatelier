import { useCallback, useEffect, useRef, useState } from "react";
import CommunitySearchBar from "../userActions/CommunitySearchBar";
import type { PostDto } from "../../dto/PostDto";
import Post from "./Post";
import useAxiosPrivate from "../../auth/useAxiosPrivate";
import { useAuthContext } from "../../auth/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import type { CommunityDto } from "../../dto/CommunityDto.ts";
import { useLocation, useParams } from "react-router-dom";
import type { RootState } from "../../store/store.ts";
import {
  addMyCommunity,
  addRecentCommunity,
  appendToFeed,
  prependPost,
  removeMyCommunity,
  setFeed,
} from "../../store/communitySlice.ts";

const POST_PATH = import.meta.env.VITE_POST_PATH;
const COMMUNITIES_PATH = import.meta.env.VITE_COMMUNITIES_PATH;

type FeedTypes = "byCommunity" | "recent" | "myFeed" | "default";

interface FeedPageParams {
  lastCreatedAt: string;
  lastId: number;
}

export default function Feed() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuthContext();

  const dispatch = useDispatch();
  const myCommunities = useSelector((state: RootState) => state.community.my);

  const { communityId } = useParams(); // e.g. "/community/sports"
  const location = useLocation(); // gives you the full path

  const feed = useSelector((state: RootState) => state.community.feed);

  const feedLoadingRef = useRef<boolean>(false);
  const [endOfFeed, setEndOfFeed] = useState(false);
  const endOfFeedRef = useRef(false);

  const feedTypeRef = useRef<FeedTypes>("default");

  const feedPageRef = useRef<FeedPageParams>({
    lastCreatedAt: "",
    lastId: 0,
  });

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

  const updateMyCommunities = async (communityDto: CommunityDto) => {
    const exists = myCommunities.some((c) => c.id === communityDto.id);

    if (exists) {
      try {
        await axiosPrivate.delete(
          `${COMMUNITIES_PATH}/unfollow/${communityDto.id}`
        );
        dispatch(removeMyCommunity(communityDto.id));
      } catch (error) {
        console.error("Error unfollowing community:", error);
      }
    } else {
      try {
        const response = await axiosPrivate.post(
          `${COMMUNITIES_PATH}/follow/${communityDto.id}`
        );
        if (response.status === 200) {
          dispatch(addMyCommunity(communityDto));
        }
      } catch (error) {
        console.error("Error following community:", error);
      }
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
      dispatch(setFeed([]));
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

      const data: PostDto[] = response.data;
      dispatch(appendToFeed(data));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === 404) {
        setEndOfFeed(true);
        endOfFeedRef.current = true;
        // TODO: starting from here, implement fetching of recent posts
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
      dispatch(setFeed([])); // changed
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
      dispatch(appendToFeed(data)); // changed
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      feedLoadingRef.current = false;
    }
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
      window.scrollTo(0, 0);
      dispatch(setFeed([]));
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
        endOfFeedRef.current = true;
        return;
      }

      const data: PostDto[] = await response.json();

      if (feedTypeRef.current !== "byCommunity" || feed.length === 0) {
        dispatch(setFeed(data));
      } else {
        dispatch(appendToFeed(data));
      }
    } catch (err) {
      console.error(err);
    } finally {
      feedLoadingRef.current = false;
    }

    dispatch(addRecentCommunity(community));
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

  const initiateDefaultFeed = async () => {
    // depending on authentication, fetch recent or personalised feed
    if (auth) {
      await fetchMyFeedAndPopulateFeed();
    } else {
      await fetchRecentFeedAndPopulateFeed();
    }
  };

  useEffect(() => {
    dispatch(setFeed([]));
    setEndOfFeed(false);
    endOfFeedRef.current = false;
    feedTypeRef.current = "default";
    feedPageRef.current = { lastCreatedAt: "", lastId: 0 };

    const init = async () => {
      if (location.pathname === "/community") {
        initiateDefaultFeed();
      } else if (location.pathname === "/community/recent") {
        fetchRecentFeedAndPopulateFeed();
      } else if (location.pathname.includes("/community/liked")) {
        fetchMyLiked();
      } else if (location.pathname.includes("/community/post")) {
        // handle fetch single post
      } else if (communityId) {
        try {
          const res = await fetch(`${COMMUNITIES_PATH}/${communityId}`);
          const communityDto: CommunityDto = await res.json();
          fetchFeedByCommunityAndPopulateFeed(communityDto);
          dispatch(addRecentCommunity(communityDto));
          console.log("adding");
        } catch (err) {
          console.error(err);
        }
      }
    };

    init();
  }, [communityId, location.pathname]);

  // on click on the post in search result
  // fetches the post and puts it at the top of the feed
  // finally scrolls to the top
  const fetchPostAndAppendItToTheTopOfTheFeed = async (id: number) => {
    try {
      const response = await fetch(`${POST_PATH}/get-post/${id}`);
      const data = await response.json();

      // remove post if already exists and prepend new one
      dispatch(prependPost(data)); // handles both removal and prepending

      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
    }
  };

  //   // TODO: Proper loading "page"
  // if (pageLoading) {
  //   return <h1>Loading...</h1>;
  // }

  return (
    <div className="community-main-subdiv community-main-subdiv--center">
      <CommunitySearchBar
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
  );
}
