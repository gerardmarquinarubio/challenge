import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import assert from 'node:assert';
import test, { describe } from 'node:test';

describe('cli integration test', () => {
    test('parses original data', () => {
        const child = spawnSync('node', ['./dist/cli.js', './tests/data.original.csv']);
        const compare = readFileSync('./tests/data.original.result.csv').toString();
        assert.deepEqual(child.stdout.toString(), compare);
    });
    
    test('parses edge case data', () => {
        const child = spawnSync('node', ['./dist/cli.js', './tests/data.edge.csv']);
        const compare = readFileSync('./tests/data.edge.result.csv').toString();
        assert.deepEqual(child.stdout.toString(), compare);
    });

    test('parses large amounts of data', () => {
        const child = spawnSync('node', ['./dist/cli.js', './tests/data.large.csv']);
        const compare = readFileSync('./tests/data.large.result.csv').toString();
        assert.deepEqual(child.stdout.toString(), compare);
    });
});