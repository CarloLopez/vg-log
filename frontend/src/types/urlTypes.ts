export type Filters = {
  [key: string]: string;
}

export type GamesFilter = {
  where?: Filters;
  search?: string;
  sort?: string;
  minRating?: string;
}