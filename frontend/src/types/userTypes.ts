import { BacklogItem, Category } from "../../../shared/types/gameTypes";

export type User = {
  username: string;
  password: string;
  backlog: BacklogItem[];
  categories: Category[];
}