import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import type { PostDto } from "../../dto/PostDto";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { DateFormatter } from "../../util/DateFormatter";
import Carousel from "../fx/Carousel";
import Comment from "./Comment";
import CreateNewComment from "../userActions/CreateNewComment";

const POST_PATH = import.meta.env.VITE_POST_PATH;
const UPLOADS_PATH = import.meta.env.VITE_MEDIA_URL;

interface FeedPageParams {
  lastCreatedAt: string;
  lastId: number;
}

export default function FullPost() {
  const location = useLocation();
  const postId = useParams().postId;

  const feed = useSelector((state: RootState) => state.community.feed);

  const feedPageRef = useRef<FeedPageParams>({
    lastCreatedAt: "",
    lastId: 0,
  });

  console.log(location);
  console.log(postId);

  const [mainPost, setMainPost] = useState<PostDto | null>(null);
  const [commentPosts, setCommentPosts] = useState<PostDto[]>([]);

  const [postMediaPathList, setPostMediaPathList] = useState<string[]>([]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`${POST_PATH}/get-post/${postId}`);
      const data: PostDto = await response.json();
      setMainPost(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${POST_PATH}/comments?postId=${postId}&lastId=${feedPageRef.current.lastId}&lastCreatedAt=${feedPageRef.current.lastCreatedAt}`
      );
      const data: PostDto[] = await response.json();
      setCommentPosts((prev) => [...prev, ...data]);
      feedPageRef.current = {
        lastCreatedAt: new Date(data[data.length - 1].createdAt).toISOString(),
        lastId: data[data.length - 1].id,
      };
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (feed && feed.length > 0) {
      const post = feed.find((post) => post.id === Number(postId));
      if (post) {
        setMainPost(post);
      } else {
        fetchPost();
      }
    } else {
      fetchPost();
    }
    fetchComments();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (mainPost?.postMediaPathList && mainPost.postMediaPathList.length > 0) {
      const fullPaths = mainPost.postMediaPathList.map(
        (path) => `${UPLOADS_PATH}${path}`
      );
      setPostMediaPathList(fullPaths);
    } else {
      setPostMediaPathList([]);
    }
  }, [mainPost?.postMediaPathList]);

  // make a better loading screen
  if (!mainPost) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fullpost-main-container">
      <div className="fullpost-mainpost-container">
        <div>
          <span className="fullpost-details">
            <span className="post-profile--left">
              <span className="fullpost-profile--left-profile">
                <img
                  src={`${UPLOADS_PATH}${mainPost.profilePicturePath || ""}`}
                  alt=""
                />
                <span className="post-profile-name">
                  {mainPost.profileName || ""}
                </span>
                <span className="mainpost-slash"> / </span>
                <div className="post-community">
                  <img
                    src={`${UPLOADS_PATH}${mainPost.communityDto?.logoImgPath}`}
                    alt="community thumbnail"
                  />
                  <div className="community-name">
                    {mainPost.communityDto?.name}
                  </div>
                  <span className="post-community-middledot">&#183;</span>
                </div>
              </span>

              {mainPost.createdAt
                ? DateFormatter.createdXAgo(mainPost.createdAt)
                : ""}
            </span>
          </span>

          <span className="post-title">{mainPost.title}</span>
        </div>
        <div>
          <span className="post-content">{mainPost.content}</span>
        </div>

        <div className="post-carousel">
          {postMediaPathList.length > 0 && (
            <div className="post-carousel-div">
              <Carousel imgUrls={postMediaPathList} />
            </div>
          )}
        </div>
        <span className="fullpost-bottom">
          <span className="post-profile--right-like">
            <img src="/heart.svg" alt="" />
          </span>
        </span>
      </div>
      <CreateNewComment />
      {commentPosts && commentPosts.length > 0 && (
        <div className="post-comments">
          <span className="post-comments-title"></span>
          {commentPosts.map((comment) => (
            <Comment post={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
