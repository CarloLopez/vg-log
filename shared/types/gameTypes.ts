export type AgeRating = {
  id: number;
  category: number;
  rating: number;
}

export type Image = {
  id: number;
  image_id: string;
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

export type Game = {
  id: number;
  cover: Image;
  name: string;
  slug?: string;
}

export type Status = "inProgress" | "notStarted" | "completed" | "dropped";

export type BacklogItem = {
  id: number;
  status: Status;
  category: number|null;
  notes: NoteItem[];
  goals: GoalItem[];
}

export type BacklogCardItem = {
  game: Game;
  state: BacklogItem;
}

export type NoteItem = {
  id: number;
  title: string;
  content: string;
}

export type Priority =  'critical'|'high'|'medium'|'low'|'none';

export type GoalItem = {
  id: number;
  content: string;
  description?: string;
  completed: boolean;
  priority: Priority;
}

export type Platform = {
  id: number;
  abbreviation: string;
}

export type Video = {
  id: number;
  video_id: string;
  name: string;
}

export type Website = {
  id: number;
  category: number;
  url: string;
}

export type Category = {
  id: number;
  name: string;
}

// define type for Games returned from API query
type GameAPI = {
  id: number;
  age_ratings?: AgeRating[];
  artworks?: Image[];
  cover: Image;
  dlcs?: Game[];
  expansions?: Game[];
  first_release_date?: number;
  game_modes?: NameObj[];
  genres?: NameObj[];
  involved_companies?: Company[];
  name: string;
  parent_game?: Game;
  platforms?: Platform[];
  player_perspectives?: NameObj[];
  screenshots?: Image[];
  similar_games?: Game[];
  storyline?: string;
  summary: string;
  themes?: NameObj[];
  total_rating?: number;
  total_rating_count?: number;
  videos?: Video[];
  websites?: Website[];
}

export default GameAPI;