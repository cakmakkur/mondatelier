import { useEffect, useState } from "react";
import type { PostDto } from "../../dto/PostDto";
import { DateFormatter } from "../../util/DateFormatter";
import type { Profile } from "../../dto/Profile";
import Carousel from "../fx/Carousel";
import type { CommunityDto } from "../../dto/CommunityDto";

interface PostProps {
  post: PostDto;
}

const PROFILE_PATH = import.meta.env.VITE_PROFILE_PATH;
const UPLOADS_PATH = import.meta.env.VITE_MEDIA_URL;
const COMMUNITIES_PATH = import.meta.env.VITE_COMMUNITIES_PATH;

export default function Post({ post }: PostProps) {
  const [profile, setProfile] = useState<Profile>();
  const [community, setCommunity] = useState<CommunityDto>();
  const [postMediaPathList, setPostMediaPathList] = useState<string[]>([]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${PROFILE_PATH}/${post.profileId}`);
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchCommunity = async () => {
    try {
      const response = await fetch(`${COMMUNITIES_PATH}/${post.communityId}`);
      const data = await response.json();
      setCommunity(data);
    } catch (error) {
      console.error("Error fetching community:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchCommunity();
  }, []);

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

  return (
    <div className="post-main-container">
      <div>
        <div className="sidebar-community">
          <img
            src={`${UPLOADS_PATH}${community?.logoImgPath}`}
            alt="community thumbnail"
          />
          <div className="community-name">{community?.name}</div>
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
          <img
            src={`${UPLOADS_PATH}${profile?.profilePicturePath || ""}`}
            alt=""
          />
          <span className="post-profile-name">
            {profile?.profileName || ""}
          </span>
          <span className="post-details-middledot">&#183;</span>
          {post.createdAt ? DateFormatter.createdXAgo(post.createdAt) : ""}
        </span>
        <span className="post-profile--right">
          <span className="post-profile--right-comment">
            <img src="/comment.svg" alt="" />
            Comments (213)
          </span>
          <span style={{ width: "30px" }}>
            <img src="/heart.svg" alt="" />
          </span>
        </span>
      </span>
    </div>
  );
}
