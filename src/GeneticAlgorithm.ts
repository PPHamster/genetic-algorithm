import { Constance, Generation } from "@packages/type";
import { GeneticService } from "@services/GeneticService";

export class GeneticAlgorithm {
  private readonly geneticService: GeneticService;

  private readonly distance: number[][];
  private readonly demand: number[][];
  private sequencePath: number[]

  private vehicleCount = 0;

  constructor(distance: number[][], demand: number[][], constance: Constance) {
    this.geneticService = new GeneticService();
    this.distance = distance;
    this.demand = demand;
    this.sequencePath = this.geneticService.createDefaultPath(1, constance.CUSTOMER_COUNT);
  }
  
}
