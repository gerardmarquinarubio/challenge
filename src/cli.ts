#!usr/bin/env node
import { createReadStream } from 'node:fs';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import { processRow } from './logic';

const parser = parse({
    fromLine: 2, // we skip the header
    skipEmptyLines: true,
}).on('error', (e) => {
    console.error(`Error parsing csv file: ${e}`);
    process.exit(1);
});

const stringifier = stringify({
    header: true,
    columns: {
        id: 'id',
        json: 'json',
        is_valid: 'is_valid',
    },
    cast: {
        boolean: (value) => value ? 'true' : 'false', // format booleans as strings (default is 0,1)
    },
    quoted_match: /^\[.*\]$/, // always quote arrays as per spec
}).on('error', (e) => {
    console.error(`Error converting output to csv: ${e}`);
    process.exit(1);
});

const transform = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    async transform([id, jsonString]: unknown[], encoding, callback) {
        try {
            if (typeof id !== 'string') {
                throw new Error('No id in row');
            }
            if (typeof jsonString !== 'string') {
                throw new Error('No values in row');
            }
            let json: unknown;
            try {
                json = JSON.parse(jsonString);
            } catch (e) {
                throw new Error('Cannot parse values in row');
            }
            if (!Array.isArray(json)) {
                throw new Error('Parsed column is not an array');
            }
            this.push(processRow(id, json));
            callback();
        } catch (error) {
            if (error instanceof Error) {
                callback(error);
            } else {
                callback(new Error(`${error}`));
            }
        }
    }
}).on('error', (e) => {
    console.error(`Error transforming row: ${e}`);
    process.exit(1);
});

async function main() {
    const input = process.argv.at(2); // get first user-provided argument

    if (typeof input !== 'string') {
        throw new Error('Need to pass a file as an argument');
    }

    await pipeline(
        createReadStream(input),
        parser,
        transform,
        stringifier,
        process.stdout
    );
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});