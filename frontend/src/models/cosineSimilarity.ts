export const cosineSimilarity = (vectorA: number[], vectorB: number[]) => {
    
  if (vectorA.length !== vectorB.length) {
    throw new Error('Error: Vector Lengths Must be the Same.');
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] ** 2;
    magnitudeB += vectorB[i] ** 2;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}