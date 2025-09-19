import { useEffect, useState } from "react";
import type { PostDto } from "../../dto/PostDto";
import { DateFormatter } from "../../util/DateFormatter";
import Carousel from "../fx/Carousel";
import type { CommunityDto } from "../../dto/CommunityDto";

interface PostProps {
  post: PostDto;
  myCommunities: CommunityDto[];
  updateMyCommunities: (communityDto: CommunityDto) => void;
}

const UPLOADS_PATH = import.meta.env.VITE_MEDIA_URL;

export default function Post({
  post,
  myCommunities,
  updateMyCommunities,
}: PostProps) {
  const [postMediaPathList, setPostMediaPathList] = useState<string[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

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
            {" "}
            <img
              src={`${UPLOADS_PATH}${post.profilePicturePath || ""}`}
              alt=""
            />
            <span className="post-profile-name">{post.profileName || ""}</span>
          </span>

          <span className="post-details-middledot">&#183;</span>
          {post.createdAt ? DateFormatter.createdXAgo(post.createdAt) : ""}
        </span>
        <span className="post-profile--right">
          <span className="post-profile--right-comment">
            <img src="/comment.svg" alt="" />
            Comments ({post.childrenPostsAmount})
          </span>
          <span className="post-profile--right-like">
            <img src="/heart.svg" alt="" />
          </span>
        </span>
      </span>
    </div>
  );
}
