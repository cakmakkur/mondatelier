// event type 1 = digital, 2 = physical

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
  type: number;
  city: string;
}
