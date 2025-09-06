import { useEffect, useState } from "react";
import { useAuthContext } from "../auth/AuthContext";
import type { CommunityDto } from "../dto/CommunityDto.ts";
import type { postDto } from "../dto/PostDto.ts";
import { useModalContext } from "../context/ModalContext.tsx";
import axios from "axios";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";

const PROFILE_PATH = import.meta.env.VITE_PROFILE_PATH;
const UPLOADS_PATH = import.meta.env.VITE_MEDIA_URL;
const COMMUNITIES_PATH = import.meta.env.VITE_COMMUNITIES_PATH;

export default function Community() {
  const axiosPrivate = useAxiosPrivate();

  const { auth } = useAuthContext();
  const { setComponentState } = useModalContext();

  const [recentCommunities, setRecentCommunities] = useState<
    [CommunityDto] | null
  >(null);
  const [topCommunities, setTopCommunities] = useState<[CommunityDto] | null>(
    null
  );
  const [feed, setFeed] = useState<[postDto] | null>(null);
  const [myCommunities, setMyCommunities] = useState<[CommunityDto] | null>();
  const [searchedCommunities, setSearchedCommunities] = useState<
    [CommunityDto] | null
  >(null);

  const fetchMyCommunities = async () => {
    if (auth) {
      try {
        const response = await axiosPrivate.get(
          `${COMMUNITIES_PATH}/my/${auth.profileId}`
        );
        if (response.ok) {
          const data = await response.json();
          setMyCommunities(data);
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    }
  };

  const getRecentCommunities = () => {
    const recentCommunities = localStorage.getItem("recentCommunities");
    if (recentCommunities) {
      setRecentCommunities(JSON.parse(recentCommunities));
    }
  };

  const searchCommunities = async (query: string) => {
    try {
      const response = await fetch(`${COMMUNITIES_PATH}/search/${query}`);
      if (response.ok) {
        const data = await response.json();
        setSearchedCommunities(data);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  const deleteRecentCommunities = () => {
    localStorage.removeItem("recentCommunities");
  };

  const fetchTopCommunities = async () => {
    try {
      const response = await axiosPrivate.get(`${COMMUNITIES_PATH}/top`);
      if (response.ok) {
        const data = await response.json();
        setTopCommunities(data);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  const fetchInitialFeed = async () => {
    if (auth) {
      try {
        const response = await axiosPrivate.get(
          `${COMMUNITIES_PATH}/feed/me/${auth.profileId}`
        );
        if (response.ok) {
          const data = await response.json();
          setFeed(data);
        }
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    } else {
      try {
        const response = await fetch(`${COMMUNITIES_PATH}/feed/recent`);
        if (response.ok) {
          const data = await response.json();
          setFeed(data);
        }
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    }
  };

  useEffect(() => {
    fetchTopCommunities();
    fetchMyCommunities();
    getRecentCommunities();
    fetchInitialFeed();
  }, []);

  return (
    <div className="community-main-div">
      <div className="community-main-subdiv community-main-subdiv--left">
        <div className="community-home">
          <img src="/home.svg" alt="" />
          <span>Home</span>
        </div>
        <div className="sidebar-communities">
          <div className="recent-communities">
            {topCommunities?.map((community) => (
              <div className="recent-community" key={community.id}>
                <img
                  src={`${UPLOADS_PATH}${community.logoImgPath}`}
                  alt="community thumbnail"
                />
                <div className="community-name">{community.name}</div>
              </div>
            ))}
          </div>
          <div className="create-new-community"></div>
          <div className="recent-communities">
            {recentCommunities?.map((community) => (
              <div className="my-community" key={community.id}>
                <img
                  src={`${UPLOADS_PATH}${community.logoImgPath}`}
                  alt="community thumbnail"
                />
                <div className="community-name">{community.name}</div>
              </div>
            ))}
          </div>
          <div className="top-communities">
            {topCommunities?.map((community) => (
              <div className="top-community" key={community.id}>
                <img
                  src={`${UPLOADS_PATH}${community.logoImgPath}`}
                  alt="community thumbnail"
                />
                <div className="community-name">{community.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="community-main-subdiv community-main-subdiv--center"></div>
      <div className="community-main-subdiv community-main-subdiv--right"></div>
    </div>
  );
}
