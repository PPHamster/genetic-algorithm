import { Generation, Population } from "@packages/type";
import fs from "fs";
import path from "path";

export class FileService {
  
  private folder: string;
  private file: string;

  constructor(folder: string, file: string = "") {
    this.folder = folder;
    this.file = file;
    this.createFolderIfNotHave(folder);
  }

  private createFolderIfNotHave(folder: string): void {
    try {
      fs.statSync(folder);
    } catch (error: unknown) {
      if (error instanceof Error) {
        fs.mkdirSync(folder);
      }
    }
  }

  public setFileName(file: string): void {
    this.file = file;
    fs.writeFileSync(path.join(this.folder, this.file), "", { flag: 'w' });
  }

  public writePopulationAndGeneration(
    populations: Population[],
    generation: Generation,
    indexGeneration: number,
  ): void {
    if (this.folder === "" || this.file === "") throw Error("Not folder or file name to write.");

    let log = `Generation: ${indexGeneration + 1}\n`;

    for (let i = 0; i < populations.length; i++) {
      log += `[${populations[i].path.join(', ')}]\t`;
      log += `${populations[i].fitness.toFixed(7)}\t`;
      log += `${populations[i].cdf.toFixed(7)}\t`;
      log += `${populations[i].distance}\n`;
    }

    log += `The minimum distance is ${generation.minDistance} with path [${generation.minPath.join(', ')}]\n`;
    log += `The average distance is ${generation.average.toFixed(2)}\n`
    log += `-------------------------------------------------------------------------------------\n`;

    fs.writeFileSync(path.join(this.folder, this.file), log, { flag: 'a+' });
    
  }

  public writeAllGentation(generations: Generation[], timeUse: number): void {
    if (this.folder === "" || this.file === "") throw Error("Not folder or file name to write.");

    let log = `No,\tAverageDistance,\tMinDistance,\tVehicleCount\n`;
    log += `------------------------------------------------\n`;

    for (let i = 0; i < generations.length; i++) {
      log += `${i},\t${generations[i].average.toFixed(2)},\t${generations[i].minDistance},\t[${generations[i].vehicleRun.join(' -> ')}]\n`;
    }

    log += `Time use : ${timeUse.toFixed(4)} second\n`;
    fs.writeFileSync(path.join(this.folder, this.file), log, { flag: 'a+' });
  }

}
