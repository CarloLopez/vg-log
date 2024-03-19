import { AgeRating } from "../../../../../../../types/gameTypes";
import LinkArray from "../../../../../../common/Array/LinkArray";

type AgeRatingProps = {
  ageRatings: AgeRating[];
}

type RatingObject = {
  [key: number]: string;
}

const AGE_RATING_ENUMS: RatingObject = {
  1: 'ESRB',
  2: 'PEGI',
  3: 'CERO',
  4: 'USK',
  5: 'GRAC',
  6: 'CLASS_IND',
  7: 'ACB',
};

const CONTENT_RATINGS: RatingObject = {
  1: 'Three',
  2: 'Seven',
  3: 'Twelve',
  4: 'Sixteen',
  5: 'Eighteen',
  6: 'RP',
  7: 'EC',
  8: 'E',
  9: 'E10',
  10: 'T',
  11: 'M',
  12: 'AO',
  13: 'A',
  14: 'B',
  15: 'C',
  16: 'D',
  17: 'Z',
  18: '0',
  19: '6',
  20: '12',
  21: '16',
  22: '18',
  23: 'ALL',
  24: 'Twelve',
  25: 'Fifteen',
  26: 'Eighteen',
  27: 'TESTING',
  28: 'L',
  29: 'Ten',
  30: 'Twelve',
  31: 'Fourteen',
  32: 'Sixteen',
  33: 'Eighteen',
  34: 'G',
  35: 'PG',
  36: 'M',
  37: 'MA15',
  38: 'R18',
  39: 'RC',
}

const getAgeRating = (ageRating: AgeRating) => {
  
  const category = AGE_RATING_ENUMS[ageRating.category];
  const rating = CONTENT_RATINGS[ageRating.rating];
  const categoryRating = `${category}_${rating}`

  return categoryRating
}

const getAgeRatings = (ageRatings: AgeRating[]) => {
  ageRatings = ageRatings.sort((a, b) => a.category - b.category);
  
  const ratings = ageRatings.map((rating) => {
    const id = rating.id;
    const name = getAgeRating(rating);

    return {id, name};
  })

  return ratings;
}

const AgeRatings = ({ ageRatings }: AgeRatingProps) => {
  const ratings = getAgeRatings(ageRatings);
  return <LinkArray items={ratings}/>
}

export default AgeRatings;