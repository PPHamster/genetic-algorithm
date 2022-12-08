import { GeneticAlgorithm } from './GeneticAlgorithm';
import { distance } from '@data/distance';
import { demand } from '@data/demand';
import { constant } from '@data/constant';

const ga = new GeneticAlgorithm(distance, demand, constant);

ga.start();
