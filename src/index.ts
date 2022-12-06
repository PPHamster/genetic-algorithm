import { distance } from '@data/distance';
import { GeneticAlgorithm } from './GeneticAlgorithm';
import { demand } from '@data/demand';
import { constance } from '@data/constance';

const ga = new GeneticAlgorithm(distance, demand, constance);

ga.start();
