export type SearchResponse = {
  podcasts: Podcast[];
  episodes: Episode[];
};

export type Episode = {
  id: number;
  name: string;
  releaseDate: Date;
  description: string;
  durationMillis: number;
  artwork: string;
  link: string;
  fileExtention: string;
  createdAt: Date;
  updatedAt: Date;
  podcast?: Podcast;
};

export type Artist = {
  id: number;
  name: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
  podcasts?: Podcast[];
};

export type Podcast = {
  id: number;
  name: string;
  link?: string;
  feedUrl?: string;
  artwork?: string;
  createdAt: Date;
  updatedAt: Date;
  artist?: Artist;
  episodes?: Episode[];
};

export enum LayoutOptions {
  GRID = "grid",
  LIST = "list",
}
