export interface PostDto {
  id: number;
  communityId: number | null;
  parentPostId: number | null;
  title: string | null;
  content: string;
  createdAt: Date;
  profileId: string;
  editedAt: Date | null;
}
