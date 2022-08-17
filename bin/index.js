#!/usr/bin/env node

// Delete the 0 and 1 argument (node and script.js)
const inputArgs = process.argv.splice(process.execArgv.length + 2);

// Retrieve the first argument
const firstArg = inputArgs[0];
const args = inputArgs.slice(1, inputArgs.length)

if(inputArgs.length === 0 || firstArg === '--help' || firstArg === '-h'){
    // TODO: provision help for users to illustrate how this can be used
    console.log("Show help")
    return
}

const {contemplate} = require('../index.js');
contemplate({
    git: {
        url: firstArg,
        args
    }
})