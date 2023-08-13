#!usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_stream_1 = require("node:stream");
const promises_1 = require("node:stream/promises");
const csv_parse_1 = require("csv-parse");
const csv_stringify_1 = require("csv-stringify");
const logic_1 = require("./logic");
const parser = (0, csv_parse_1.parse)({
    fromLine: 2,
    skipEmptyLines: true,
});
const stringifier = (0, csv_stringify_1.stringify)({
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
});
const transform = new node_stream_1.Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform([id, jsonString], encoding, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof id !== 'string') {
                throw new Error('No id in row');
            }
            if (typeof jsonString !== 'string') {
                throw new Error('No values in row');
            }
            let json;
            try {
                json = JSON.parse(jsonString);
                if (!Array.isArray(json)) {
                    throw new Error('Parsed column is not an array');
                }
            }
            catch (e) {
                throw new Error('Cannot parse values in row');
            }
            this.push((0, logic_1.processRow)(id, json));
            callback();
        });
    }
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const input = process.argv.at(2); // get first user-provided argument
        if (typeof input !== 'string') {
            throw new Error('Need to pass a file as an argument');
        }
        yield (0, promises_1.pipeline)((0, node_fs_1.createReadStream)(input), parser, transform, stringifier, process.stdout);
    });
}
main().catch(console.error);
