// event type 1 = digital, 2 = physical

export interface Event {
  id: string;
  title: string;
  type: number;
  city: string;
  description: string;
  createdAt: Date;
  date: Date;
  profileId: string;
  thumbnail_url: string;
}
