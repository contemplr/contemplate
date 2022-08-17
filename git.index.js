const {exec} = require("child_process");
const fs = require("fs");
const {info} = require("./utils.index");

// https://stackoverflow.com/a/5717133/11984714
function isValidURL(input) {
    return input !== null && input !== undefined &&
        new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i')// fragment locator
            .test(input);
}

function fetchFolderName(url, args){
    if (args && Array.isArray(args) && args.length > 0) {
        return args[0]
    }

    const urlParts = url.split('/')
    return urlParts[urlParts.length - 1].replace('.git', '')
}

function cloneRepository(props = {}) {
    return new Promise((resolve, reject) => {
        // git arguments for cloning the repository
        const {
            url, // the git or repository url the template is to be pulled from
            args = [], // other git args that should be specified during cloning
        } = props.git

        if (!isValidURL(url)) {
            reject(new Error(`Invalid repository URL [${url}]. \nPlease provide a valid repository URL`))
        }

        if (!args || !Array.isArray(args)) {
            reject(new Error(`Invalid arguments "${args.join(" ")}". \nArguments must be of array type`))
        }

        // TODO: add args
        exec(`git clone ${url} ${args.join(' ')}`, (error, stdout, stderr) => {
            if (stderr) {
                info(String(stderr))
            }

            if (error) {
                reject(new Error("Error cloning repository"))
            }

            // remove existing `.git` folder
            const destFolder = `./${fetchFolderName(url, args)}`
            fs.rmSync(`${destFolder}/.git`, { recursive: true, force: true });

            resolve({stdout, props, destFolder})
        });
    });
}

module.exports = {fetchFolderName, cloneRepository}