const clc = require("cli-color");

function info(message) {
    console.log(message)
}

function infoWhite(message) {
    console.log(clc.white(message))
}

function green(message) {
    console.log(clc.green(message))
}

function errorAndExit(message) {
    console.log(clc.red(message))
    process.exit(1)
}

module.exports = {errorAndExit, info, infoWhite, green}