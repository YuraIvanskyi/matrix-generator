/* eslint-disable */
import { evaluate, parse, parser } from 'mathjs';

var start = 0; 

export function evaluateExpressionMatrix(matrix) {
    
    const evaluations = matrix.horisontalPatterns;
    const rowAmount = matrix.horisontalPatterns.length;
    const colAmount = matrix.verticalSigns.length;
    const solvedRows = [];
    let sets = [];
    const verticalSigns = matrix.verticalSigns;
    const validSets = [];
    //build all possible solutions for equations
    console.log(`Started at ${Date.now()}, elapsed ${Date.now() - start}`);
    start = Date.now(); 

    for (let index = 0; index < rowAmount; index++) {
        solvedRows.push(buildExpression(evaluations[index].digits, evaluations[index].signs));
    }

    console.log(`All [${solvedRows.length}] built at ${Date.now()}, elapsed ${Date.now() - start}`);
    start = Date.now(); 
    //create all combinations of hosrizontal solutions

    sets = solvedRows.reduce(combineArrays);

    console.log(`Combined [${sets.length}] at ${Date.now()}, elapsed ${Date.now() - start}`);
    start = Date.now(); 

    const setsAmount = sets.length;
    for (let index = 0; index < setsAmount; index++) {
        sets[index] = sets[index].flat(Infinity);
        let subset = [];
        while (sets[index].length !== 0 )
            subset.push(sets[index].splice(0,colAmount));
        sets[index] = subset;
    }

    console.log(`All [${setsAmount}] flat at ${Date.now()}, elapsed ${Date.now() - start}`);
    start = Date.now(); 

    for (let index = 0; index < setsAmount; index++) {
        sets[index] = transpose(sets[index]);
    }

    console.log(`Transposed at ${Date.now()}, elapsed ${Date.now() - start}`);
    start = Date.now(); 

    for (let index = 0; index < setsAmount; index++) {
        const currentSetLength = sets[index].length;
        const currentSetDigits = [...Array(currentSetLength).keys()];
        if(currentSetDigits.every( i => tryEquate(verticalSigns[i], sets[index][i])))
            validSets.push(transpose(sets[index]));
        else sets[index] = null;
    }
    /*sets.forEach((set, index) => {
        if([...Array(set.length).keys()].every( i => tryEquate(verticalSigns[i], set[i])))
            validSets.push(transpose(set));
    })*/
    console.log(`Valid at ${Date.now()}, elapsed ${Date.now() - start}`);
    start = Date.now(); 

    return validSets;

}

function combineArrays(array1, array2) {
    const result = [];
    const a1Amount = array1.length;
    const a2Amount = array2.length;
    for(let i = 0; i < a1Amount; i++) {
        for (let j = 0; j < a2Amount; j++) {
            result.push([array1[i], array2[j]]);
        }
    }
    return result;
}
export function transpose(a) {
    return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) { return r[c]; });
    });
}

export function buildExpression(elements, operators) {
    const varietiesAmount = elements.filter(e => e.toString().includes('▢')).length;
    const expressionSolutions = [];
    const elementsAmount = elements.length;
    for (let index = 0; index < elementsAmount; index++) {
        const isEmpty = elements[index].toString().includes('▢');
        if(isEmpty)
            elements[index] = [...Array(Math.pow(10,elements[index].length)).keys()].slice(Math.pow(10,elements[index].length-1));
    }
    for (let step = 0; step < varietiesAmount; step++) {
        if(step === 0)
            elements = resolveVariety(elements);
        else {
            let levelBuffer = [];
            const toEquateAmount = elements.length;
            for(let i = 0; i < toEquateAmount; i++) {
                levelBuffer.push(...resolveVariety(elements[i]));
            }
            elements = levelBuffer;
        } 
    }
    console.log(`Resolved varieties at ${Date.now()}, elapsed ${Date.now() - start}`);
    start = Date.now(); 
    const toEquateAmount = elements.length;
    for (let index = 0; index < toEquateAmount; index++) {
        const equationResult = tryEquate(operators, elements[index]);
        if(equationResult) {
            expressionSolutions.push(elements[index]);
        }
            
    }
    console.log(`Got expressions at ${Date.now()}, elapsed ${Date.now() - start}`);
    start = Date.now(); 
    return expressionSolutions;
    
}

function resolveVariety(values) { // [1,[4,5],3] -> [[1,4,3],[1,5,3]]
    const result = [];
    const valuesLength = values.length;
    for(let item = 0; item < valuesLength; item++) {
        if(Array.isArray(values[item])) {
            const head = values.slice(0, item);
            const tail = values.slice(item).slice(1);
            values[item].forEach(element => result.push([...head, element, ...tail]));
            break;
        }
    }

    return result;
}

function tryEquate(operators, elements) {
    const equation = zipSignsNumbers(operators, elements);
    const equationParts = equation.split('=');
    const e_left = equationParts[0];
    const e_right = equationParts[1];
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
