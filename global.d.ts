declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';

      POPULATION_SIZE: number,
      CUSTOMER_COUNT: number,
      WEIGHT_LIMIT: number,
      CROSSOVER_RATE: number,
      MUTATION_RATE: number,
      NUMBER_OF_RUN: number,
    }
  }
}

export { };
