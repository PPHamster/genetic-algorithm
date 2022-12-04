export type Constance = {
  POPULATION_SIZE: number,
  CUSTOMER_COUNT: number,
  WEIGHT_LIMIT: number,
  CROSSOVER_RATE: number,
  MUTATION_RATE: number,
  NUMBER_OF_RUN: number,
}

export type Population = {
  path: number[],
  fitness: number,
  cdf: number,
  distance: number,
}

export type Generation = {
  minPath: number[],
  minDistance: number,
  average: number,
}
