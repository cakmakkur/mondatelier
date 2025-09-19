import { useEffect, useState } from "react";
import type { PostDto } from "../../dto/PostDto";
import { DateFormatter } from "../../util/DateFormatter";
import Carousel from "../fx/Carousel";

interface CommentProps {
  post: PostDto;
}
const UPLOADS_PATH = import.meta.env.VITE_MEDIA_URL;

export default function Comment({ post }: CommentProps) {
  const [postMediaPathList, setPostMediaPathList] = useState<string[]>([]);

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
          <span className="comment-profile--right-like">
            <img src="/heart.svg" alt="" />
          </span>
        </span>
      </span>
    </div>
  );
}
