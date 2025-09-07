import { useEffect, useState } from "react";
import type { PostDto } from "../../dto/PostDto";
import { DateFormatter } from "../../util/DateFormatter";
import type { Profile } from "../../dto/Profile";
import Carousel from "../fx/Carousel";

interface PostProps {
  post: PostDto;
}

const PROFILE_PATH = import.meta.env.VITE_PROFILE_PATH;
const UPLOADS_PATH = import.meta.env.VITE_MEDIA_URL;

export default function Post({ post }: PostProps) {
  const [profile, setProfile] = useState<Profile>();
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

  useEffect(() => {
    fetchProfile();
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
        <span className="post-profile">
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
      </span>
    </div>
  );
}
