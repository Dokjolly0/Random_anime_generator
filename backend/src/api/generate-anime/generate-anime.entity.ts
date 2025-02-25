export interface Anime {
  url: string;
  cover: string;
  banner: string | null;
  title: string;
  description: string;
  episodes: number;
  genres: string[];
  rating: number | string;
  type: string;
  episodeDuration: string;
  status: string;
  season: string;
  studio: string;
  favorites: string;
  members: string;
  views: string;
  year: number | string;
  otherInfoFetched: any;
  startRequest: number;
  endRequest: number;
  requestTime: number;
}
