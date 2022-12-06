import { Constance, Generation, Population } from "@packages/type";
import { GeneticService } from "@services/GeneticService";

export class GeneticAlgorithm {
  private readonly geneticService: GeneticService;

  private readonly distance: number[][];
  private readonly demand: number[][];
  private constance: Constance;

  private populations: Population[];
  private generations: Generation[];

  constructor(distance: number[][], demand: number[][], constance: Constance) {
    this.geneticService = new GeneticService();

    this.distance = distance;
    this.demand = demand;
    this.constance = constance;

    this.populations = [];
    this.generations = [];
  }

  // Define first generation by shuffle index 1 - customer count
  public initalizePath(): void {
    let defaultPath = this.geneticService.createDefaultPath(1, this.constance.CUSTOMER_COUNT);
    for (let i = 0; i < this.constance.POPULATION_SIZE; i++) {
      defaultPath = this.geneticService.shuffle(defaultPath);
      this.populations.push(this.geneticService.createPopulation(defaultPath, 0, 0, 0));
    }
  }

  // Calculate and fill fitness ratio, CDF, distance for previous path
  public evaluate(): void {
    let allDistanceSum = 0, minDistance = Number.MAX_VALUE;
    let minPath: number[] = [], minVehicleRun: number[] = [];

    // Loop for find all sum of distance using specified distance and demand
    for (let i = 0; i < this.constance.POPULATION_SIZE; i++) {
      let demandSum = 0, distanceSum = 0, vehicleCount = 0;
      let vehicleRun: number[] = [];
      const currentPath = [0, ...this.populations[i].path];

      // Loop each population
      for (let j = 0; j < currentPath.length - 1; j++) {
        const nextDemand = this.demand[this.constance.DEMAND_CHOOSEN][currentPath[j + 1]];

        // If can demand and not overflow
        if (demandSum + nextDemand <= this.constance.WEIGHT_LIMIT) {
          demandSum += nextDemand;
          distanceSum += this.distance[currentPath[j]][currentPath[j + 1]];
          vehicleCount += 1;
        }
        // Demand overflow then back to start point and go to next path
        else {
          demandSum = nextDemand;
          distanceSum += (this.distance[currentPath[j]][0] + this.distance[0][currentPath[j + 1]]);
          vehicleRun.push(vehicleCount);
          vehicleCount = 1;
        }
      }

      // Back to start point from last customer
      distanceSum += this.distance[currentPath[currentPath.length - 1]][0];
      vehicleRun.push(vehicleCount);
      allDistanceSum += distanceSum;

      this.populations[i].distance = distanceSum;

      // Record min distance and min vehicle run from all population
      if (distanceSum < minDistance) {
        minDistance = distanceSum;
        minPath = [...this.populations[i].path];
        minVehicleRun = [...vehicleRun];
      }
    }

    // Find fitness ratio
    const average = allDistanceSum / this.constance.POPULATION_SIZE;
    const maxBalance = this.constance.MAX_DISTANCE * this.constance.POPULATION_SIZE - allDistanceSum;
    const fitness: number[] = [];
    let fitnessSum = 0;

    // If current distance less than average, the fitness ratio will be much higher
    for (let i = 0; i < this.constance.POPULATION_SIZE; i++) {
      let currentFitness = (this.constance.MAX_DISTANCE - this.populations[i].distance) / maxBalance;
      if (this.populations[i].distance <= average) currentFitness += average / allDistanceSum;
      fitnessSum += currentFitness;
      fitness.push(currentFitness);
    }

    // Fill CDF from each fitness ratio
    for (let i = 0; i < this.constance.POPULATION_SIZE; i++) {
      this.populations[i].fitness = fitness[i] / fitnessSum;
      if (i == 0) this.populations[i].cdf = this.populations[i].fitness;
      else this.populations[i].cdf = this.populations[i - 1].cdf + this.populations[i].fitness;
    }

    // Add new generation into result (min path, min distance, average, vehicle running)
    this.generations.push(this.geneticService.createGeneration(
      minPath,
      minDistance,
      average,
      minVehicleRun,
    ));
  }

  // Create new all of population path
  public reproduction(): void {
    const nextPopulations: Population[] = [];

    // Loop each population
    for (let i = 0; i < this.constance.POPULATION_SIZE; i++) {
      // Mutation
      if (this.geneticService.randomPercentFromDecimal(this.constance.MUTATION_RATE)) {
        const newPath = this.geneticService
          .mutation(this.populations[i].path, this.constance.CUSTOMER_COUNT);
        nextPopulations.push(this.geneticService.createPopulation(newPath, 0, 0, 0));
      }
      // Crossover
      else if (this.geneticService.randomPercentFromDecimal(this.constance.CROSSOVER_RATE)) {
        const indexParentOne = this.geneticService.selectParentIndex(this.populations);
        const indexParentTwo = this.geneticService.selectParentIndex(this.populations);

        const newPath = this.geneticService.crossover(
          this.populations[indexParentOne].path,
          this.populations[indexParentTwo].path,
          this.constance.CUSTOMER_COUNT
        );
        nextPopulations.push(this.geneticService.createPopulation(newPath, 0, 0, 0));
      }
      // Replace path
      else {
        nextPopulations.push(this.geneticService.createPopulation(this.populations[i].path, 0, 0, 0));
      }
    }
    // Replace current population with next population
    this.populations = [...nextPopulations];
  }

  public start(): void {
    // Initialization process
    this.initalizePath();

    let round: number;
    let canStop = false;
    let noChangeCount = 0;

    for (round = 0; round < this.constance.TERMINAL_CRITERIA && !canStop; round++) {
      // Calculate fitness ratio, CDF, distance for record into current generation
      this.evaluate();

      // If not first round and min distance from each generation not change many time
      if (round !== 0 && this.generations[round].minDistance === this.generations[round - 1].minDistance) {
        canStop = ++noChangeCount >= this.constance.NO_IMPROVEMENT;
      }
      // min distance change before no improvement value
      else {
        noChangeCount = 0;
      }
      
      // The last round not necessary to reproduction
      if (round !== this.constance.TERMINAL_CRITERIA - 1) this.reproduction();
    }

    console.log(`Use ${round} rounds`);
    console.log(`The last generation is`);
    console.log(this.generations[this.generations.length - 1]);
  }

}
