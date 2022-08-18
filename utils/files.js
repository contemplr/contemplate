const fs = require("fs");

function isConsideredValidFile(file) {
    return file && file.isFile() && file.name
        && file.name.includes(".")
        && !file.name.startsWith(".")
}

function isExcludedFolder(regexes = [], input) {
    for (let i = 0; i < regexes.length; i++) {
        if (regexes && regexes[i].test(input))
            return true
    }
    return false
}

async function replaceTextOccurrencesWhere(path, variables) {
    return new Promise(((resolve, reject) => {
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) reject(err)

            let result = data
            let newPath = path
            for (let v = 0; v < variables.length; v++) {
                const variable = variables[v]
                const name = variable.name
                const value = variable.value

                if (!name || !value) continue

                result = result.replaceAll(name, value)
                newPath = newPath.replaceAll(name, value)
            }

            fs.writeFile(path, result, 'utf8', function (err) {
                if (err) reject(err)

                // rename file where need be if the new path doesn't match the initial path
                if(path !== newPath){
                    fs.renameSync(path, newPath)
                }
                resolve(path)
            });
        });
    }))
}

function removeFile(path) {
    fs.rmSync(path, {force: true, maxRetries: 5})
}

module.exports = {isConsideredValidFile, isExcludedFolder, replaceTextOccurrencesWhere, removeFile}