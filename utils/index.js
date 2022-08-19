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
    console.log("\n")
}

function showHelpInstructions() {
    welcomeMessage()

    const helpInstructions = "\033[1mUSAGE\033[0m \ncontemplate repository_url [destination_folder] \n" +
        "\nFor example:\n  " +
        "$ \033[1mcontemplate https://github.com/contemplr/spring-sample-auth-jwt\033[0m RubyHera"

    console.log(helpInstructions)
    console.log("\n")
}

module.exports = {errorAndExit, info, infoWhite, infoGreen, welcomeMessage, showHelpInstructions}