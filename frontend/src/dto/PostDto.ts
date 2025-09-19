import type { CommunityDto } from "./CommunityDto";

export interface PostDto {
  id: number;
  communityDto: CommunityDto | null;
  parentPostId: number | null;
  title: string | null;
  content: string;
  createdAt: Date;
  profileId: string;
  editedAt: Date | null;
  postMediaPathList: string[];
  profilePicturePath: string;
  profileName: string;
  childrenPostsAmount: number;
  likesAmount: number;
}
