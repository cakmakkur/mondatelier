import { useEffect, useState } from "react";
import { useAuthContext } from "../auth/AuthContext";
import type { CommunityDto } from "../dto/CommunityDto.ts";
import { useModalContext } from "../context/ModalContext.tsx";
import useAxiosPrivate from "../auth/useAxiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store.ts";
import { clearCommunities } from "../store/recentCommunitiesSlice.ts";

import CreateCommunity from "../components/userActions/CreateCommunity.tsx";
import { Link, Outlet } from "react-router-dom";

const COMMUNITIES_PATH = import.meta.env.VITE_COMMUNITIES_PATH;
const UPLOADS_PATH = import.meta.env.VITE_MEDIA_URL;

export default function Community() {
  const { auth } = useAuthContext();
  const axiosPrivate = useAxiosPrivate();
  const { setComponentState } = useModalContext();

  const [pageLoading, setPageLoading] = useState(true);

  const dispatch = useDispatch();
  const recent = useSelector((state: RootState) => state.community.recent);

  const [topCommunities, setTopCommunities] = useState<CommunityDto[]>([]);
  const [myCommunities, setMyCommunities] = useState<CommunityDto[]>([]);

  const [topCommunitiesExtended, setTopCommunitiesExtended] = useState(false);
  const [myCommunitiesExtended, setMyCommunitiesExtended] = useState(false);
  const [recentCommunitiesExtended, setRecentCommunitiesExtended] =
    useState(false);

  // clears recently visited communities from the localstorage
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

  // fetches the communities that the user follows
  const fetchMyCommunities = async () => {
    if (!auth) return;
    try {
      const response = await axiosPrivate.get(`${COMMUNITIES_PATH}/me`);
      setMyCommunities(response.data);
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  const initiate = async () => {
    // fetch top communities and users communities if authenticated
    await Promise.all([fetchTopCommunities(), fetchMyCommunities()]);
    setPageLoading(false);
  };

  useEffect(() => {
    initiate();
  }, [auth]);

  // TODO: Proper loading "page"
  if (pageLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="community-main-div">
      <div className="community-main-subdiv community-main-subdiv--left">
        <Link to="/community" className="community-home">
          <img src="/home.svg" alt="" />
          <span>Home</span>
        </Link>
        <Link to="/community/recent" className="community-recent-post">
          <img src="/recent.svg" alt="" />
          <span>Recent Posts</span>
        </Link>
        <Link to="/community/liked" className="community-liked">
          <img src="/heart.svg" alt="" />
          <span>Liked</span>
        </Link>
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
          <span className="sidebar-communities-title">Top Communities</span>
          {topCommunities?.map((community) => (
            <Link
              to={`/community/${community.id}`}
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
            </Link>
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
        {recent.length > 0 && (
          <>
            <div
              className={`sidebar-communities ${
                recentCommunitiesExtended ? "sidebar-communities--extended" : ""
              }`}
            >
              <span className="sidebar-communities-title">
                Recent Communities
              </span>
              {recent.map((community) => (
                <Link
                  to={`/community/${community.id}`}
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
                </Link>
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
              <img src="delete.svg" alt="" />
              <span>Delete recent communities</span>
            </div>
          </>
        )}

        {auth && (
          <div
            className={`sidebar-communities ${
              myCommunitiesExtended ? "sidebar-communities--extended" : ""
            }`}
          >
            <span className="sidebar-communities-title"> My Communities</span>
            {myCommunities?.map((community) => (
              <Link
                to={`/community/${community.id}`}
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
              </Link>
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
      <Outlet />
      <div className="community-main-subdiv community-main-subdiv--right"></div>
    </div>
  );
}
