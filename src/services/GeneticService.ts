import { Population } from "@packages/type";

export class GeneticService {

  constructor() {}

  public createDefaultPath(start: number, stop: number): number[] {
    const array = [];
    for (let i = start; i <= stop; i++) {
      array.push(i);
    }
    return array;
  }

  public createArray(size: number, initValue: number): number[] {
    const array: number[] = [];
    for (let i = 0; i < size; i++) {
      array.push(initValue);
    }
    return array;
  }

  public createArray2d(row: number, column: number, initValue: number): number[][] {
    const array: number[][] = [];
    for (let i = 0; i < row; i++) {
      array.push([]);
      for (let j = 0; j < column; j++) {
        array[i].push(initValue);
      }
    }
    return array;
  }

  public randomNumberBetween(min: number, max: number): number {
    return Math.floor((Math.random() * (max - min + 1))) + min;
  }

  public isRepeat(value: number, array: number[]): boolean {
    return array.some((numberInArray) => value === numberInArray);
  }

  public shuffle(array: number[]): void {
    for (let i = array.length - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * i);
      const temp = array[randomIndex];
      array[randomIndex] = array[i];
      array[i] = temp;
    }
  }

  public selectParentIndex(populations: Population[]): number {
    const random = Math.random();

    for (let i = 0; i < populations.length; i++) {
      if (populations[i].cdf >= random) return i;
    }

    return 0;
  }
  
  public mutation(path: number[]) {
    const first = this.randomNumberBetween(1, 14);
    const second = this.randomNumberBetween(1, 14);

    const temp = path[first];
    path[first] = path[second];
    path[second] = temp;
  }
}
