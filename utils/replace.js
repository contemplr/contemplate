const fs = require("fs");
const {isConsideredValidFile, isExcludedFolder, replaceTextOccurrencesWhere} = require("./files");

function replaceOccurrences(destFolder, variables, excludeFoldersRegex) {
    // read list of all files in the destination folder
    const files = fs.readdirSync(destFolder, {withFileTypes: true})

    // using divide and conquer process each variable replacement
    let pivot = files.length / 2
    if (pivot < 2) pivot = files.length
    _replaceOccurrences(destFolder, files.slice(0, pivot), variables, excludeFoldersRegex).then()
    _replaceOccurrences(destFolder, files.slice(pivot + 1, files.length), variables, excludeFoldersRegex).then()
}

async function _replaceOccurrences(destFolder, files, variables, excludeFoldersRegex) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const path = `${destFolder}/${file.name}`

        // selected file is to be excluded continue
        if (isExcludedFolder(excludeFoldersRegex, path)) continue

        // if file is a directory, recursively replaceOccurrences
        if (file.isDirectory()) {
            replaceOccurrences(path, variables, excludeFoldersRegex)
            continue
        }

        // if file is considered valid, run occurrence search and replace
        if (isConsideredValidFile(file))
            replaceTextOccurrencesWhere(path, variables).then()
    }
}

module.exports = {replaceOccurrences}