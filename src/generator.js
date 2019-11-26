/* eslint-disable */
import { evaluate } from 'mathjs';
const bigCartesian = require('big-cartesian');

var start = 0;
export var latestAction = [];

export function evaluateExpressionMatrix(matrix, stopAmount) {
    let totalOperationTime = Date.now();
    const evaluations = [...matrix.horisontalPatterns];
    const rowAmount = matrix.horisontalPatterns.length;
    const colAmount = matrix.verticalSigns.length;
    const solvedRows = [];
    let sets = [];
    const verticalSigns = [...matrix.verticalSigns];
    const validSets = [];
    //build all possible solutions for equations

    start = Date.now(); 

    for (let index = 0; index < rowAmount; index++) {
        solvedRows.push(buildExpression(evaluations[index].digits, evaluations[index].signs));
    }
    log(`All [${solvedRows.length}] expressions built in ${Date.now() - totalOperationTime} ms`);
    start = Date.now(); 
    //create all combinations of hosrizontal solutions
    let foundCount = 0;
    for (const values of bigCartesian(solvedRows)) {

        let isValidSet = true;
        for (let setIndex = 0; setIndex < colAmount; setIndex++) {
            const columnEq = getCol(values,setIndex);
            const eqResult = tryEquate(verticalSigns[setIndex], columnEq);
            if(!eqResult) {
                isValidSet = false;
                break;
            }
        }
        if(isValidSet) {
            foundCount++;
            if(foundCount % 100 === 0)
                console.log(`Found ${foundCount} solutions by now, processing...`)
            validSets.push(values);
            if(foundCount === stopAmount) {
                console.log(`Found all ${stopAmount} needed.`)
                break;
            }
        }
    }

    log(`Separated [${validSets.length}] valid in ${Date.now() - start} ms`);
    start = Date.now(); 
    log(`Total operation time - [${(Date.now() - totalOperationTime)/1000}] s.`)
    return validSets;

}

function getCol(arr, i) {
    const els = [];
    for(const el in arr)
        els.push(arr[el][i]);
    return els;
}

export function transpose(matrix) {
    return Object.keys(matrix[0])
        .map(colNumber => matrix.map(rowNumber => rowNumber[colNumber]));
}

function buildExpression(elements, operators) {
    const expressionSolutions = [];
    const elementsAmount = elements.length;
    for (let index = 0; index < elementsAmount; index++) {
        const isEmpty = elements[index].toString().includes('▢');
        if(isEmpty)
            elements[index] = [...Array(Math.pow(10,elements[index].length)).keys()].slice(Math.pow(10,elements[index].length-1));
    }
    elements.forEach((i,index) => Array.isArray(i) !== true ? elements[index] = [i] : elements[index] = i);
    log(`Resolved variations in ${Date.now() - start} ms`);

    for (const values of bigCartesian(elements)) {
        if(tryEquate(operators, values)) {
            expressionSolutions.push(values);
        }
    }

    log(`Evaluated expressions in ${Date.now() - start} ms`);
    start = Date.now(); 
    return expressionSolutions;
    
}

function tryEquate(operators, elements) {
    const equation = zipSignsNumbers(operators, elements);
    const equationParts = equation.split('=');
    const e_left = equationParts[0];
    const e_right = parseInt(equationParts[1]);
    const equationResult = evaluate(e_left) == e_right;
    return equationResult;
}

export function zipSignsNumbers(signs, numbers) {
    const zip = [];
    const numbersAmount = numbers.length - 1;
    for (let i = 0; i < numbersAmount; i++) {
        zip.push(numbers[i],')', signs[i]);
        zip.unshift('(');
    }
    zip.push(numbers[numbersAmount]);
    return zip.join('');
}

function log(message) {
    latestAction.push(message);
    console.log(message);
}
