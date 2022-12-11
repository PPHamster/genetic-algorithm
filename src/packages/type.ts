export type Constant = {
  POPULATION_SIZE: number,
  CUSTOMER_COUNT: number,
  MAX_DISTANCE: number,
  WEIGHT_LIMIT: number,
  CROSSOVER_RATE: number,
  MUTATION_RATE: number,
  NUMBER_OF_RUN: number,
  DEMAND_CHOOSEN: number,
  TERMINAL_CRITERIA: number,
  NO_IMPROVEMENT: number,
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
  maxDistance: number,
  average: number,
  vehicleRun: number[],
}
