import dotenv from 'dotenv';
import { distance } from '@data/distance';
import { GeneticAlgorithm } from './GeneticAlgorithm';
import { demand } from '@data/demand';
import { constance } from '@data/constance';
import { GeneticService } from '@services/GeneticService';

dotenv.config();

const ga = new GeneticAlgorithm(distance, demand, constance);
const gs = new GeneticService();

