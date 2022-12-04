"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneticService = void 0;
class GeneticService {
    constructor() { }
    createArray(size, initValue) {
        const array = [];
        for (let i = 0; i < size; i++) {
            array.push(initValue);
        }
        return array;
    }
    createArray2d(row, column, initValue) {
        const array = [];
        for (let i = 0; i < row; i++) {
            array.push([]);
            for (let j = 0; j < column; j++) {
                array[i].push(initValue);
            }
        }
        return array;
    }
    randomNumberBetween(min, max) {
        return Math.floor((Math.random() * (max - min + 1))) + min;
    }
    isRepeat(value, array) {
        return array.some((numberInArray) => value === numberInArray);
    }
    shuffle(array) {
        for (let i = array.length - 1; i >= 0; i--) {
            const randomIndex = Math.floor(Math.random() * i);
            const temp = array[randomIndex];
            array[randomIndex] = array[i];
            array[i] = temp;
        }
    }
}
exports.GeneticService = GeneticService;
