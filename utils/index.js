const clc = require("cli-color");

function info(message) {
    console.log(message)
}

function infoWhite(message) {
    console.log(clc.white(message))
}

function infoGreen(message) {
    console.log(clc.green(message))
}

function errorAndExit(message) {
    console.log(clc.red(message))
    process.exit(1)
}

function welcomeMessage() {
    console.log("  _                                       \n" +
        " / ` _   _  _)_ _   _ _   _   ) _  _)_ _  \n" +
        "(_. (_) ) ) (_ )_) ) ) ) )_) ( (_( (_ )_) \n" +
        "              (_        (            (_   ")
    console.log()
    console.log()
}

module.exports = {errorAndExit, info, infoWhite, infoGreen, welcomeMessage}