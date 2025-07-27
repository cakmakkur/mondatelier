export default interface Masterclass {
  id: string;
  profileId: string;
  title: string;
  description: string;
  sessions: number;
  sessionDuration: number;
  sessionPrice: number;
  createdAt: string;
  artCategory: string;
  city: string;
}
