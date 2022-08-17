const {cloneRepository} = require("./git.index")
const fs = require("fs");
const readline = require('readline');
const {errorAndExit, info, infoWhite} = require("./utils.index");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const util = require('util');
const question = util.promisify(rl.question).bind(rl);

const CONFIG_FILE_NAME = "contvar.json"

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

async function collectInputs(config) {
    const variables = config.variables
    for(let i = 0; i < variables.length; i++) {
        const variable = variables[i]
        if(!variable || typeof variable !== 'object')
            continue // if the variable is invalid continue to next item

        const name = variable['name']
        const prompt = variable['prompt']

        if(!name) continue // if the variable name is invalid continue to next item

        // collect the `value` of a variable `name` from the user
        infoWhite(prompt ?? `Enter the value for "${name}":`)
        variable['value'] = await question("")

        delete variable['prompt'] // remove the prompt property from the object to lighten the result
    }

    rl.close()
    return variables
}

function replaceOccurrences(destFolder, variables) {
    // console.log(variables)
    const files = fs.readdirSync(destFolder, {withFileTypes: true})
    // console.log(files)

    // using divide and conquer process each variable replacement
    let pivot = files.length / 2
    if(pivot < 2) pivot = files.length
    _replaceOccurrences(destFolder, files.slice(0, pivot), variables).then()
    _replaceOccurrences(destFolder, files.slice(pivot + 1, files.length), variables).then()
}

async function _replaceOccurrences(destFolder, files, variables) {
    // console.log(files)
    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if(file.isDirectory()) {
            console.log(`${destFolder}/${file.name}`)
            replaceOccurrences(`${destFolder}/${file.name}`, variables)
            continue
        }

        // TODO: set file size limit, read individual files async, and find and replace occurrences
        //  there's a need to limit file size because files of outrageous size are most likely
        //  media files rather than editable files + also ignore dot files and files without extension
        //  except user explicitly wants them to be processed
    }
}

const contemplate = (props = {}) => {
    // properties that'll be used to guide the "contemplation" process
    const {
        git: {
            url // the git or repository url the template is to be pulled from
        }
    } = props

    if (typeof url !== 'string') {
        errorAndExit(`❌  Please specify your repository URL \`contemplate {repository_url}\`)`)
    }

    info(` - 🔮 Generating template [${url}]`)
    cloneRepository(props).then(output => {
        const {destFolder} = output

        info(` - 🔍 Reading variables configuration [contvar.json]`)
        const config = configFromJSON(destFolder)

        info(` - 🛠 Let's customize your new project...`)
        console.log("") // empty line before questions

        // collect variable inputs as value from user
        collectInputs(config)
            .then(variables => replaceOccurrences(destFolder, variables))
    }).catch(e => errorAndExit(`❌  ${e.message}`))
}

module.exports = {contemplate, configFromJSON, replaceOccurrences}