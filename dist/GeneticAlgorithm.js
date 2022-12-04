"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneticAlgorithm = void 0;
const GeneticService_1 = require("./services/GeneticService");
class GeneticAlgorithm {
    constructor(path, demand, constance) {
        this.geneticService = new GeneticService_1.GeneticService();
        this.path = path;
        this.demand = demand;
        this.population = this.geneticService.createArray2d(constance.POPULATION_SIZE, process.env.NUMBER_PER_POPULATION_SIZE, -1);
    }
}
exports.GeneticAlgorithm = GeneticAlgorithm;
