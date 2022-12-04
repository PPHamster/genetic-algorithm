"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = require("./data/path");
const GeneticAlgorithm_1 = require("./GeneticAlgorithm");
const demand_1 = require("./data/demand");
const constance_1 = require("./data/constance");
const GeneticService_1 = require("./services/GeneticService");
dotenv_1.default.config();
const ga = new GeneticAlgorithm_1.GeneticAlgorithm(path_1.path, demand_1.demand, constance_1.constance);
const gs = new GeneticService_1.GeneticService();
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
for (let i = 0; i < 40; i++) {
    console.log(arr);
    gs.shuffle(arr);
}
