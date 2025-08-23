interface Media {
  id: string;
  path: string;
  isThumbnail: boolean;
}

export interface Artwork {
  id: string;
  title: string;
  profileId: string;
  artCategory: string;
  salable: boolean;
  price: number;
  releaseYear: number;
  dimensions: string;
  duration: number;
  artTypes: string[];
  mediaType: string;
  medias: Media[];
}
