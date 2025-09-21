import { useEffect, useRef, useState } from "react";
import type { PostDto } from "../../dto/PostDto";
import { DateFormatter } from "../../util/DateFormatter";
import Carousel from "../fx/Carousel";
import type { CommunityDto } from "../../dto/CommunityDto";
import { Link } from "react-router-dom";
import type { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import useAxiosPrivate from "../../auth/useAxiosPrivate";
import {
  addLike,
  addMyCommunity,
  removeLike,
  removeMyCommunity,
  setScrollY,
} from "../../store/communitySlice";
import type { FeedTypes } from "./Feed";
import { useAuthContext } from "../../auth/AuthContext";

interface PostProps {
  post: PostDto;
  feedType: FeedTypes;
}
const COMMUNITIES_PATH = import.meta.env.VITE_COMMUNITIES_PATH;
const UPLOADS_PATH = import.meta.env.VITE_MEDIA_URL;
const POST_PATH = import.meta.env.VITE_POST_PATH;

export default function Post({ post, feedType }: PostProps) {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuthContext();

  const dispatch = useDispatch();
  const myCommunities = useSelector((state: RootState) => state.community.my);
  const likes = useSelector((state: RootState) => state.community.likes);

  const [postMediaPathList, setPostMediaPathList] = useState<string[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const heartIconEmptyRef = useRef<HTMLImageElement>(null);
  const heartIconFillRef = useRef<HTMLImageElement>(null);

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

  const handleFollowClick = async () => {
    if (post.communityDto === null) return;
    try {
      updateMyCommunities(post.communityDto);
    } catch (error) {
      console.error("Error following community:", error);
    }
  };

  const handleLikeClick = async () => {
    if (!auth) return; // here sign in modal
    if (isLiked) {
      try {
        const response = await axiosPrivate.delete(
          `${POST_PATH}/unlike/${post.id}`
        );
        if (response.status === 204) {
          dispatch(removeLike(post.id));
          setIsLiked(false);
        }
      } catch (error) {
        console.error(error);
        // handle error
      }
    } else {
      try {
        const response = await axiosPrivate.post(
          `${POST_PATH}/like/${post.id}`
        );
        if (response.status === 200) {
          dispatch(addLike(post.id));
          setIsLiked(true);
        }
      } catch (error) {
        console.error(error);
        // handle error
      }
    }
  };

  useEffect(() => {
    if (!heartIconEmptyRef.current || !heartIconFillRef.current) return;

    if (isLiked) {
      // liked → show fill, hide empty
      heartIconFillRef.current.classList.remove(
        "post-profile--right-like-inactive"
      );
      heartIconFillRef.current.classList.add("post-profile--right-like-active");

      heartIconEmptyRef.current.classList.remove(
        "post-profile--right-like-active"
      );
      heartIconEmptyRef.current.classList.add(
        "post-profile--right-like-inactive"
      );
    } else {
      // not liked → show empty, hide fill
      heartIconEmptyRef.current.classList.remove(
        "post-profile--right-like-inactive"
      );
      heartIconEmptyRef.current.classList.add(
        "post-profile--right-like-active"
      );

      heartIconFillRef.current.classList.remove(
        "post-profile--right-like-active"
      );
      heartIconFillRef.current.classList.add(
        "post-profile--right-like-inactive"
      );
    }
  }, [isLiked]);

  useEffect(() => {
    if (post.postMediaPathList && post.postMediaPathList.length > 0) {
      const fullPaths = post.postMediaPathList.map(
        (path) => `${UPLOADS_PATH}${path}`
      );
      setPostMediaPathList(fullPaths);
    } else {
      setPostMediaPathList([]);
    }
  }, [post.postMediaPathList]);

  useEffect(() => {
    if (
      myCommunities.find((community) => community.id === post.communityDto?.id)
    ) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [myCommunities, post.communityDto?.id]);

  useEffect(() => {
    if (likes.find((like) => like === post.id)) {
      setIsLiked(true);
    }
  }, [likes, post.id]);

  return (
    <div className="post-main-container">
      <div>
        <div
          style={{ display: feedType === "byCommunity" ? "none" : "" }}
          className="post-community"
        >
          <img
            src={`${UPLOADS_PATH}${post.communityDto?.logoImgPath}`}
            alt="community thumbnail"
          />
          <div className="community-name">{post.communityDto?.name}</div>
          <span className="post-community-middledot">&#183;</span>
          {isFollowing ? (
            <button
              className="post-follow-toggle post-follow-toggle--unfollow"
              onClick={handleFollowClick}
            >
              Unfollow
            </button>
          ) : (
            <button
              className="post-follow-toggle post-follow-toggle--follow"
              onClick={handleFollowClick}
            >
              Follow
            </button>
          )}
        </div>
        <span className="post-title">{post.title}</span>
      </div>
      <div>
        <span className="post-content">{post.content}</span>
      </div>

      <div className="post-carousel">
        {postMediaPathList.length > 0 && (
          <div className="post-carousel-div">
            <Carousel imgUrls={postMediaPathList} />
          </div>
        )}
      </div>

      <span className="post-details">
        <span className="post-profile--left">
          <span className="post-profile--left-profile">
            <img
              src={`${UPLOADS_PATH}${post.profilePicturePath || ""}`}
              alt="profile picture of the poster"
            />
            <Link
              to={`/profile/${post.profileId || ""}`}
              className="post-profile-name"
            >
              {post.profileName || ""}
            </Link>
          </span>

          <span className="post-details-middledot">&#183;</span>
          {post.createdAt ? DateFormatter.createdXAgo(post.createdAt) : ""}
        </span>
        <span className="post-profile--right">
          <span className="post-profile--right-share">
            <img src="/share.svg" alt="" />
          </span>
          <Link
            onClick={() => dispatch(setScrollY(window.scrollY))}
            to={`/community/post/${post.id}`}
            className="post-profile--right-comment"
          >
            <img src="/comment.svg" alt="show comments button icon" />
            Comments ({post.childrenPostsAmount})
          </Link>
          <span onClick={handleLikeClick} className="post-profile--right-like">
            <img
              ref={heartIconEmptyRef}
              className="post-profile--right-like-empty"
              src="/heart.svg"
              alt="like icon"
            />
            <img
              ref={heartIconFillRef}
              className="post-profile--right-like-fill"
              src="/heart-fill.svg"
              alt="unlike icon"
            />
          </span>
        </span>
      </span>
    </div>
  );
}
