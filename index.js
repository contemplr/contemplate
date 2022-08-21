const fs = require("fs");
const {cloneRepository} = require("./utils/git")
const {errorAndExit, info, infoGreen, welcomeMessage, error} = require("./utils/logger");
const {replaceOccurrences} = require("./utils/replace");

// initiate prompt stream
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const util = require('util');
const {isInvalidInput, isValidVariableName} = require("./utils/inputs");
const question = util.promisify(rl.question).bind(rl);

// this represents the name of the configuration file in the template repository
// actual full name [contemplate + variables]
const CONFIG_FILE_NAME = "contvar.json"

/**
 * Take the destination folder as input and read out the configuration specification
 * @param destFolder The cloned template folder destination
 * @returns {Object} The template configuration [CONFIG_FILE_NAME] content is returned as a JSONObject
 */
function configFromJSON(destFolder) {
    const file = `${destFolder}/${CONFIG_FILE_NAME}`

    if (!fs.existsSync(file))
        throw new Error(`❌ Error reading config file from "${file}`)

    const configObj = JSON.parse(String(fs.readFileSync(file)))
    const variables = configObj['variables']
    if (!Array.isArray(variables))
        throw new Error(`❌ Invalid "variables" property provided in configuration. ` +
            `Please ensure "variables" is an array`)

    return configObj
}

/**
 * This collects the custom inputs from user to be used for the template customization
 * @param config The JSON object of the project customization
 * @returns {Object} The variables + inputs from user returned as a JSONObject
 */
async function collectInputs(config) {
    const variables = config.variables
    let i = 0
    while (i < variables.length) {
        const variable = variables[i]
        const checks = variable.checks
        if (!variable || typeof variable !== 'object') {
            i += 1 // move to the next variable
            continue // if the variable is invalid continue to next item
        }

        const name = variable['name']
        if (!name && isValidVariableName(name)) {
            i += 1 // move to the next variable
            continue // if the variable name is invalid continue to next item
        }

        const prompt = variable['prompt']

        // collect the `value` of a variable `name` from the user
        infoGreen(prompt ?? `Enter the value for "${name}":`)
        const value = await question("")

        // For now, if user enters an invalid value, repeat question again
        const errorMessage = isInvalidInput(checks, value)
        if(errorMessage !== true) {
            error(errorMessage)
            continue
        }

        variable['value'] = value // set the user's input as the variable value
        delete variable['prompt'] // remove the prompt property from the object to lighten the result

        i += 1 // move to the next variable
    }

    rl.close()
    return variables
}

function cleanup(destFolder) {
    // TODO: remove the configuration file as part of clean up
    //  also we can specify an `after` property in the configuration that allows users to specify run
    //  commands like `mvn install` or `npm install` after contemplate is done generating a template
    //  for it to install the dependencies of the template
}

const contemplate = (props = {}) => {
    // show tool welcome message
    welcomeMessage()

    // properties that'll be used to guide the "contemplation" process
    const {
        git: {
            url // the git or repository url the template is to be pulled from
        },
        excludeFoldersRegex
    } = props

    if (typeof url !== 'string') {
        errorAndExit(`❌  Please specify your repository URL \`contemplate {repository_url}\`)`)
    }

    if (excludeFoldersRegex && !Array.isArray(excludeFoldersRegex)) {
        errorAndExit(`❌  "excludeFoldersRegex" should be an Array, ${typeof excludeFoldersRegex} provided`)
    }

    info(` - 🔮 Generating template [${url}]`)
    cloneRepository(props).then(output => {
        const {destFolder} = output

        info(` - 🔍 Reading variables configuration [contvar.json]`)
        const config = configFromJSON(destFolder)
        console.log() // empty line before prompts

        info(` - 🛠 Let's customize your new project...`)
        console.log() // empty line before prompts

        // collect variable inputs as value from user
        collectInputs(config).then(variables => {
            console.log() // empty line before prompts

            // start replacing variables
            info(` - ⏳ Working...`)
            replaceOccurrences(destFolder, variables, excludeFoldersRegex)
        }).then(() => {
            // clean up templated folder & done
            cleanup(destFolder)
            info(` - ✅ Done!`)
        })
    }).catch(e => errorAndExit(`❌  ${e.message}`))
}

module.exports = {contemplate, configFromJSON}