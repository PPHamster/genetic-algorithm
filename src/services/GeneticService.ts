import { Generation, Population } from "@packages/type";

export class GeneticService {

  constructor() {}

  // Create default path ex. [1, 2, 3, 4, ..., 13, 14]
  public createDefaultPath(start: number, stop: number): number[] {
    const array = [];
    for (let i = start; i <= stop; i++) {
      array.push(i);
    }
    return array;
  }

  // Create array by size and initial value
  public createArray(size: number, initValue: number): number[] {
    const array: number[] = [];
    for (let i = 0; i < size; i++) {
      array.push(initValue);
    }
    return array;
  }

  // Create new population object
  public createPopulation(
    path: number[],
    fitness: number,
    cdf: number,
    distance: number
  ): Population {
    return { path: [...path], fitness, cdf, distance };
  }

  // Create new generation object
  public createGeneration(
    minPath: number[],
    minDistance: number,
    average: number,
    vehicleRun: number[],
  ): Generation {
    return { minPath: [...minPath], minDistance, average, vehicleRun: [...vehicleRun] };
  }

  // Random number between two value
  public randomNumberBetween(min: number, max: number): number {
    return Math.floor((Math.random() * (max - min + 1))) + min;
  }

  // Random probability from percent input
  public randomPercentFromDecimal(percent: number):boolean {
    return this.randomNumberBetween(0, 99) < percent * 100;
  }

  // Check this value repeat in result path or not
  public isRepeat(value: number, array: number[]): boolean {
    return array.some((numberInArray) => value === numberInArray);
  }

  // Shuffle path
  public shuffle(path: number[]): number[] {
    const newPath = [...path];
    for (let i = newPath.length - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * i);
      const temp = newPath[randomIndex];
      newPath[randomIndex] = newPath[i];
      newPath[i] = temp;
    }
    return newPath;
  }

  // Select parent from population by cdf
  public selectParentIndex(populations: Population[]): number {
    const random = Math.random();

    for (let i = 0; i < populations.length; i++) {
      if (populations[i].cdf >= random) return i;
    }

    return 0;
  }
  
  // Mutation path by random index
  public mutation(path: number[], customerCount: number): number[] {
    const newPath = [...path];
    const first = this.randomNumberBetween(0, customerCount - 1);
    const second = this.randomNumberBetween(0, customerCount - 1);

    const temp = newPath[first];
    newPath[first] = newPath[second];
    newPath[second] = temp;

    return newPath;
  }

  // Crossover two parent into new path using PMX
  public crossover(
    parentOne: number[],
    parentTwo: number[],
    customerCount: number,
  ): number[] {
    const indexof = this.createArray(14, -1);
    const newPath = this.createArray(14, -1);

    const pointOne = this.randomNumberBetween(3, Math.floor(customerCount / 2 - 1));
    const pointTwo = this.randomNumberBetween(Math.floor(customerCount / 2 + 1), customerCount - 2);

    for (let i = pointOne; i < pointTwo; i++) {
      newPath[i] = parentTwo[i];
      indexof[newPath[i]] = i;
    }

    for (let i = 0; i < pointOne; i++) {
      let value = parentOne[i];
      while (this.isRepeat(value, newPath)) {
        value = parentOne[indexof[value]];
      }
      newPath[i] = value;
      indexof[newPath[i]] = i;
    }

    for (let i = pointTwo; i < parentOne.length; i++) {
      let value = parentOne[i];
      while (this.isRepeat(value, newPath)) {
        value = parentOne[indexof[value]];
      }
      newPath[i] = value;
      indexof[newPath[i]] = i;
    }

    return newPath;
  }

}
