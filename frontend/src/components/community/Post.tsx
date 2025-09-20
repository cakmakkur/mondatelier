import { useEffect, useState } from "react";
import type { PostDto } from "../../dto/PostDto";
import { DateFormatter } from "../../util/DateFormatter";
import Carousel from "../fx/Carousel";
import type { CommunityDto } from "../../dto/CommunityDto";
import { Link } from "react-router-dom";
import type { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import useAxiosPrivate from "../../auth/useAxiosPrivate";
import {
  addMyCommunity,
  removeMyCommunity,
  setScrollY,
} from "../../store/communitySlice";

interface PostProps {
  post: PostDto;
}
const COMMUNITIES_PATH = import.meta.env.VITE_COMMUNITIES_PATH;
const UPLOADS_PATH = import.meta.env.VITE_MEDIA_URL;

export default function Post({ post }: PostProps) {
  const axiosPrivate = useAxiosPrivate();

  const dispatch = useDispatch();
  const myCommunities = useSelector((state: RootState) => state.community.my);

  const [postMediaPathList, setPostMediaPathList] = useState<string[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

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

  return (
    <div className="post-main-container">
      <div>
        <div className="post-community">
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
            <span className="post-profile-name">{post.profileName || ""}</span>
          </span>

          <span className="post-details-middledot">&#183;</span>
          {post.createdAt ? DateFormatter.createdXAgo(post.createdAt) : ""}
        </span>
        <span className="post-profile--right">
          <Link
            onClick={() => dispatch(setScrollY(window.scrollY))}
            to={`/community/post/${post.id}`}
            className="post-profile--right-comment"
          >
            <img src="/comment.svg" alt="show comments button icon" />
            Comments ({post.childrenPostsAmount})
          </Link>
          <span className="post-profile--right-like">
            <img src="/heart.svg" alt="" />
          </span>
        </span>
      </span>
    </div>
  );
}
