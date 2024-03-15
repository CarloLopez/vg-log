export type AgeRating = {
  id: number;
  category: number;
  rating: number;
}

type Image = {
  id: number;
  image_id: string;
}

type DLC = {
  id: number;
  cover: Image;
  name: string;
}

export type NameObj = {
  id: number;
  name: string;
}

export type Company = {
  id: number;
  company: NameObj;
  developer: boolean;
  publisher: boolean;
  supporting: boolean;
}

type Game = {
  id: number;
  cover: Image;
  name: string;
}

export type Platform = {
  id: number;
  abbreviation: string;
}

type Video = {
  id: number;
  video_id: string;
}

type Website = {
  id: number;
  category: number;
  url: string;
}


// define type for Games returned from API query
type gameTypes = {
  id: number;
  age_ratings?: AgeRating[];
  artworks?: Image[];
  cover: Image;
  dlcs?: DLC[]; // 
  expansions?: DLC[]; //
  first_release_date?: number;
  game_modes?: NameObj[];
  genres?: NameObj[];
  involved_companies?: Company[];
  name: string;
  parent_game?: Game; //
  platforms?: Platform[];
  player_perspectives?: NameObj[];
  screenshots?: Image[];
  similar_games?: Game[]; // 
  storyline?: string;
  summary: string;
  themes?: NameObj[];
  total_rating?: number;
  total_rating_count?: number;
  videos?: Video[];
  websites?: Website[];
}

export default gameTypes;