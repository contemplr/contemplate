#!/usr/bin/env node
const {contemplate} = require('../index.js');
const {showHelpInstructions} = require("../utils/logger");

// Delete the 0 and 1 argument (node and script.js)
const inputArgs = process.argv.splice(process.execArgv.length + 2);

// Retrieve the first argument
const firstArg = inputArgs[0];
const args = inputArgs.slice(1, inputArgs.length)

if(inputArgs.length === 0 || firstArg === '--help' || firstArg === '-h'){
    showHelpInstructions()
    process.exit()
}

contemplate({
    git: {
        url: firstArg,
        args
    }
})