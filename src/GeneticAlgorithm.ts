import { Constant, Generation, Population } from "@packages/type";
import { FileService } from "@services/FileService";
import { GeneticService } from "@services/GeneticService";

export class GeneticAlgorithm {
  private readonly geneticService: GeneticService;
  private readonly fileService: FileService;

  private readonly distance: number[][];
  private readonly demand: number[][];
  private readonly constant: Constant;

  private populations: Population[];
  private generations: Generation[];

  constructor(distance: number[][], demand: number[][], constant: Constant) {
    this.geneticService = new GeneticService();
    this.fileService = new FileService('logs');

    this.distance = distance;
    this.demand = demand;
    this.constant = constant;

    this.populations = [];
    this.generations = [];
  }

  // Define first generation by shuffle index 1 - customer count
  private initalizePath(): void {
    let defaultPath = this.geneticService.createDefaultPath(1, this.constant.CUSTOMER_COUNT);
    for (let i = 0; i < this.constant.POPULATION_SIZE; i++) {
      defaultPath = this.geneticService.shuffle(defaultPath);
      this.populations.push(this.geneticService.createPopulation(defaultPath, 0, 0, 0));
    }
  }

  // Calculate and fill fitness ratio, CDF, distance for previous path
  private evaluate(): void {
    let allDistanceSum = 0, minDistance = Number.MAX_VALUE, maxDistance = 0;
    let minPath: number[] = [], minVehicleRun: number[] = [];

    // Loop for find all sum of distance using specified distance and demand
    for (let i = 0; i < this.constant.POPULATION_SIZE; i++) {
      let demandSum = 0, distanceSum = 0, vehicleCount = 0;
      let vehicleRun: number[] = [];
      const currentPath = [0, ...this.populations[i].path];

      // Loop each population
      for (let j = 0; j < currentPath.length - 1; j++) {
        const nextDemand = this.demand[this.constant.DEMAND_CHOOSEN][currentPath[j + 1]];

        // If can demand and not overflow
        if (demandSum + nextDemand <= this.constant.WEIGHT_LIMIT) {
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

      // Record max distance
      if (distanceSum > maxDistance) {
        maxDistance = distanceSum;
      }

    }

    // Find fitness ratio
    const average = allDistanceSum / this.constant.POPULATION_SIZE;
    const maxBalance = this.constant.MAX_DISTANCE * this.constant.POPULATION_SIZE - allDistanceSum;
    const fitness: number[] = [];
    let fitnessSum = 0;

    // If current distance less than average, the fitness ratio will be much higher
    for (let i = 0; i < this.constant.POPULATION_SIZE; i++) {
      let currentFitness = (this.constant.MAX_DISTANCE - this.populations[i].distance) / maxBalance;
      if (this.populations[i].distance <= average) currentFitness += average / allDistanceSum;
      fitnessSum += currentFitness;
      fitness.push(currentFitness);
    }

    // Fill CDF from each fitness ratio
    for (let i = 0; i < this.constant.POPULATION_SIZE; i++) {
      this.populations[i].fitness = fitness[i] / fitnessSum;
      if (i == 0) this.populations[i].cdf = this.populations[i].fitness;
      else this.populations[i].cdf = this.populations[i - 1].cdf + this.populations[i].fitness;
    }

    // Add new generation into result (min path, min distance, average, vehicle running)
    this.generations.push(this.geneticService.createGeneration(
      minPath,
      minDistance,
      maxDistance,
      average,
      minVehicleRun,
    ));
  }

  // Create new all of population path
  private reproduction(): void {
    const nextPopulations: Population[] = [];

    // Loop each population
    for (let i = 0; i < this.constant.POPULATION_SIZE; i++) {
      // Mutation
      if (this.geneticService.randomPercentFromDecimal(this.constant.MUTATION_RATE)) {
        const newPath = this.geneticService
          .mutation(this.populations[i].path, this.constant.CUSTOMER_COUNT);
        nextPopulations.push(this.geneticService.createPopulation(newPath, 0, 0, 0));
      }
      // Crossover
      else if (this.geneticService.randomPercentFromDecimal(this.constant.CROSSOVER_RATE)) {
        const indexParentOne = this.geneticService.selectParentIndex(this.populations);
        const indexParentTwo = this.geneticService.selectParentIndex(this.populations);

        const newPath = this.geneticService.crossover(
          this.populations[indexParentOne].path,
          this.populations[indexParentTwo].path,
          this.constant.CUSTOMER_COUNT
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

    const startTime = new Date().getTime();
    let round: number;
    let canStop = false;
    let noChangeCount = 0;

    // Write log file into log.txt
    this.fileService.setFileName("log.txt");

    for (round = 0; round < this.constant.TERMINAL_CRITERIA && !canStop; round++) {
      // Calculate fitness ratio, CDF, distance for record into current generation
      this.evaluate();
      this.fileService.writePopulationAndGeneration(this.populations, this.generations[round], round);

      // If not first round and min distance from each generation not change many time
      if (round !== 0 && this.generations[round].minDistance === this.generations[round - 1].minDistance) {
        canStop = ++noChangeCount >= this.constant.NO_IMPROVEMENT;
      }
      // min distance change before no improvement value
      else {
        noChangeCount = 0;
      }
      
      // The last round not necessary to reproduction
      if (round !== this.constant.TERMINAL_CRITERIA - 1 && !canStop) this.reproduction();
    }

    const timeUse = (new Date().getTime() - startTime) / 1000;

    // Write result file into result.txt
    this.fileService.setFileName("result.txt");
    this.fileService.writeAllGeneration(this.generations, timeUse);

    this.fileService.setFileName("graph.csv");
    this.fileService.writeFileGraph(this.generations);
    
    console.log(`Use ${round} rounds`);
    console.log(`The last generation is`);
    console.log(this.generations[this.generations.length - 1]);
  }

}
