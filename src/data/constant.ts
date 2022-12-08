import dotenv from 'dotenv';
dotenv.config();

export const constant = {
  POPULATION_SIZE: process.env.POPULATION_SIZE,
  CUSTOMER_COUNT: process.env.CUSTOMER_COUNT,
  MAX_DISTANCE: process.env.MAX_DISTANCE,
  WEIGHT_LIMIT: process.env.WEIGHT_LIMIT,
  CROSSOVER_RATE: process.env.CROSSOVER_RATE,
  MUTATION_RATE: process.env.MUTATION_RATE,
  NUMBER_OF_RUN: process.env.NUMBER_OF_RUN,
  DEMAND_CHOOSEN: process.env.DEMAND_CHOOSEN,
  TERMINAL_CRITERIA: process.env.TERMINAL_CRITERIA,
  NO_IMPROVEMENT: process.env.NO_IMPROVEMENT,
}
