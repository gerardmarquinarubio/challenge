# README

## Usage

Simply clone this repo and call `npm install && npm run build`, you can use the program with `npm start ./input_file.csv`.

## Description of the program

1. This program reads a csv-formatted file (passed by argv) with two columns: id and json.
2. The json column will will be parsed as a JSON array.
3. The array will be interpreted as an N * N matrix and all of the elements will be shifted counter-clockwise by one.
4. If the array cannot be transformed to a N * N matrix the row will be marked as invalid and the array will be empty.
5. Will finally output to stdout following the original row order with the columns id, json, and is_valid.
    - Id is the original id value for that row.
    - json will be the stringified and flattened matrix that is shifted counter-clockwise. If the original array could not be transformed it will be an empty array.
    - is_valid will be true if the array could be transformed.

## Input data assumptions

1. The csv has a header.
2. The csv must have two columns, the first column is the id and the second column is the json.
3. The id column must exist. It may or may not be unique. It must be any type except an empty value.
4. The json column:
    - Must be an JSON-parseable array containing numbers.
    - Be surrounded by double quotes.
    - Single-element arrays are assumed to be valid.
    - The array will be procesable as long as it's length can be expressed as `x = |⌊√x⌋^2|`.
    - Empty arrays are valid. Therefore there is a difference between the output:
        - `{id}, [], true`: An empty array that was properly parsed.
        - `{id}, [], false`: An array that couldn't be parsed and now is empty and invalid.

## Scope

Some things in this program might be sub-optimal because this is just intended as a coding challenge, but I would like to still note a couple things.

1. Types: I think there should be some type definitions for the records we parse here, what is `id`? what is `json`? If this would be a program that is managing data from another service then that other service should be directly responsible for exporting type definitions which this package would then import.
2. CLI options: If this tool is intended to be more generalistic I would expand the CLI arguments with the `commander` package.
    - The passed path might be a csv file or a folder. In case it is a folder you might specify...
    - `--output=<path>`, this is a path to a folder where the output will be written to instead of stdout.
    - `--rotate=[L,R]`, this will choose the direction of the rotation, defaults to "L" as per spec.
    - `--rotations=<integer>`, this will rotate the matrix N times, defaults to 1 as per spec. If given negative values it will take the absolute number and swap the rotation direction.
3. Error handling:
    - If this program were meant to be used by users directly better error messages would be added such as 'Could not read file, check your permissions and try again'. However for this exercise I think it isn't necessary.
    - I'm assuming that incorrectly formatted rows that cannot be read are the same as a forceful exit. One could argue against this and say that it should output the id, an empty array and false, but then there are different questions that remain unsolved. For example what happens with a row that has no id? Because I think this would break a meaningful output I think forcefully exiting the program with an error is prefered.
4. External packages: CSV parsing packages have been used. Theese packages differ from the ones recommended in the challenge, my reasoning being that the packages used here are part of a wider collection of csv packages which helps with better interopability, also one of the packages recommended in the challenge has no typescript definitions, but most importantly the packages I used here are widely more used and updated; because file-parsing is not something trivial and one of the first attack vectors I would never use a package such as `csv-stream` with 5k weekly downloads and a version that was last published 5 years ago. On the downside the packages used here are bigger by an order of magnitude. If allocated more time and properly diagnosed that the csv parsing and stringifying is a bottleneck I would be in favor of parsing the csv file manually.
5. Distribution files would normally not be uploaded and added to .gitignore, however for this challenge I'll leave it as it is for better 