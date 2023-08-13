import { processRow } from '../src/logic';
import assert from 'node:assert';
import test, { describe } from 'node:test';

describe('logic unit test', () => {
    test('transform 1x1 matrix', () => {
        const [,result] = processRow('', [1]);
        assert.deepEqual(result, [1]);
    });
    
    test('transform 2x2 matrix', () => {
        const [,result] = processRow('', [ 
            1, 2, 
            3, 4
        ]);
        assert.deepEqual(result, [
            2, 4, 
            1, 3
        ]);
    });
    
    test('transform 3x3 matrix', () => {
        const [,result] = processRow('', [
            1, 2, 3, 
            4, 5, 6, 
            7, 8, 9
        ]);
        assert.deepEqual(result, [
            2, 3, 6, 
            1, 5, 9, 
            4, 7, 8
        ]);
    });
    
    test('transform 4x4 matrix', () => {
        const [,result] = processRow('', [
            1,  2,  3,  4, 
            5,  6,  7,  8, 
            9, 10, 11, 12,
            13, 14, 15, 16
        ]);
        assert.deepEqual(result, [
            2,  3,  4,  8,  
            1,  7, 11, 12,  
            5,  6, 10, 16, 
            9, 13, 14, 15
        ]);
    });
    
    test('keeps id', () => {
        let [id,,] = processRow('69', [1, 4, 5, 5, 6]);
        assert.equal(id, '69');
        [id,,] = processRow('420', [1, 4, 5, 5, 6]);
        assert.equal(id, '420');
    });
    
    test('marks empty arrays as valid', () => {
        const [,,result] = processRow('', []);
        assert.equal(result, true);
    });
    
    test('marks non-squareable arrays as invalid', () => {
        let [,,result] = processRow('', [1, 4, 5, 5, 6]);
        assert.equal(result, false);
        [,,result] = processRow('', [1, 4, 5, 5, 6, 7, 8, 9, 10, 11, 12]);
        assert.equal(result, false);
        [,,result] = processRow('', [1, 4, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
        assert.equal(result, false);
    });
});