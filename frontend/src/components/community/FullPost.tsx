import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type { PostDto } from "../../dto/PostDto";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { DateFormatter } from "../../util/DateFormatter";
import Carousel from "../fx/Carousel";
import Comment from "./Comment";
import CreateNewPost from "../userActions/CreateNewPost";
import { setRememberScroll } from "../../store/communitySlice";
import { useDispatch } from "react-redux";

const POST_PATH = import.meta.env.VITE_POST_PATH;
const UPLOADS_PATH = import.meta.env.VITE_MEDIA_URL;

interface FeedPageParams {
  lastCreatedAt: string;
  lastId: number;
}

export default function FullPost() {
  const dispatch = useDispatch();

  const postId = useParams().postId;
  const feed = useSelector((state: RootState) => state.community.feed);

  const feedPageRef = useRef<FeedPageParams>({
    lastCreatedAt: "",
    lastId: 0,
  });

  const [mainPost, setMainPost] = useState<PostDto | null>(null);
  const [commentPosts, setCommentPosts] = useState<PostDto[]>([]);

  const [postMediaPathList, setPostMediaPathList] = useState<string[]>([]);

  const postsLoadingRef = useRef<boolean>(false);
  const endOfFeedRef = useRef(false);
  const fetchCommentsRef = useRef<() => Promise<void>>(async () => undefined);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastVisibleRef = useCallback(
    (node: HTMLSpanElement | null) => {
      if (observer.current) observer.current.disconnect();

      if (!node) return;

      observer.current = new IntersectionObserver(
        async (entries) => {
          if (
            entries[0].isIntersecting &&
            !endOfFeedRef.current &&
            !postsLoadingRef.current
          ) {
            void fetchCommentsRef.current();
          }
        },
        { root: null, threshold: 0.1 }
      );

      observer.current.observe(node);
    },
    []
  );

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
    if (postsLoadingRef.current) return;

    postsLoadingRef.current = true;
    try {
      const response = await fetch(
        `${POST_PATH}/comments?postId=${postId}&lastId=${feedPageRef.current.lastId}&lastCreatedAt=${feedPageRef.current.lastCreatedAt}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch comments (${response.status})`);
      }
      const data: PostDto[] = await response.json();
      if (data.length === 0) {
        endOfFeedRef.current = true;
        return;
      }
      setCommentPosts((previous) => {
        const knownIds = new Set(previous.map((post) => post.id));
        return [...previous, ...data.filter((post) => !knownIds.has(post.id))];
      });
      feedPageRef.current = {
        lastCreatedAt: new Date(data[data.length - 1].createdAt).toISOString(),
        lastId: data[data.length - 1].id,
      };
    } catch (err) {
      console.error(err);
    } finally {
      postsLoadingRef.current = false;
    }
  };
  fetchCommentsRef.current = fetchComments;

  useEffect(() => {
    const init = async () => {
      setMainPost(null);
      setCommentPosts([]);
      endOfFeedRef.current = false;
      feedPageRef.current = { lastCreatedAt: "", lastId: 0 };

      let post: PostDto | undefined;
      if (feed && feed.length > 0) {
        post = feed.find((p) => p.id === Number(postId));
      }

      if (post) {
        setMainPost(post);
      } else {
        await fetchPost();
      }

      await fetchComments();
      window.scrollTo(0, 0);
    };

    init();
    // Initialization is keyed by the route instance; feed updates must not
    // restart comment pagination.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

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

  const handleReturn = () => {
    dispatch(setRememberScroll(true));
    history.back();
  };

  // make a better loading screen
  if (!mainPost) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fullpost-main-container">
      <div className="fullpost-mainpost-container">
        <div onClick={handleReturn} className="fullpost-back-container">
          <img src="/back.svg" alt="back to feed button icon" />
        </div>
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
          <span className="post-profile--right-share">
            <img src="/share.svg" alt="" />
          </span>
          <span className="post-profile--right-like">
            <img src="/heart.svg" alt="" />
          </span>
        </span>
      </div>
      <CreateNewPost
        communityId={mainPost.communityDto!.id}
        parentPostId={mainPost.id}
      />
      {commentPosts && commentPosts.length > 0 && (
        <div className="post-comments">
          <span className="post-comments-title"></span>
          {commentPosts.map((comment, i) => {
            let isTrigger = false;

            if (commentPosts.length >= 5 && !endOfFeedRef.current) {
              if (i === commentPosts.length - 5) {
                isTrigger = true;
              }
            } else if (i === commentPosts.length - 1 && !endOfFeedRef.current) {
              isTrigger = true;
            }
            return (
              <span
                key={comment.id + comment.profileId}
                ref={isTrigger ? lastVisibleRef : null}
              >
                <Comment post={comment} />
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
