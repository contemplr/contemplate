#!/usr/bin/env node

// Delete the 0 and 1 argument (node and script.js)
const inputArgs = process.argv.splice(process.execArgv.length + 2);

// Retrieve the first argument
const url = inputArgs[0];
const args = inputArgs.slice(1, inputArgs.length)

const {contemplate} = require('../index.js');
contemplate({
    git: {
        url,
        args
    }
})