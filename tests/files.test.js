const {isConsideredValidFile, isExcludedFolder, replaceTextOccurrencesWhere, removeFile} = require("../utils/files");
const fs = require("fs");

const filesInSampleFolder = fs.readdirSync("./sample/", {withFileTypes: true})

test("fails file is not considered valid", () => {
    return expect(isConsideredValidFile(filesInSampleFolder
        .filter(file => file.name.includes(".gitkeep"))[0]))
        .toBe(false)
})

test("success file is considered valid", () => {
    return expect(isConsideredValidFile(filesInSampleFolder
        .filter(file => file.name.includes("valid"))[0]))
        .toBe(true)
})

test("success exclude node_modules folder", () => {
    expect(isExcludedFolder([/node_modules/], "rando/node_modules"))
        .toBe(true)
    expect(isExcludedFolder([/ab(.*?)de/], "rando/abcde"))
        .toBe(true)
    expect(isExcludedFolder([/node_modules/, /ab(.*?)de/], "rando/abcde"))
        .toBe(true)
    expect(isExcludedFolder([/node_modules/, /ab(.*?)de/], "rando/ade"))
        .toBe(false)
})

test("success replace text occurrences", async () => {
    const testFile = "testFile.txt"

    // remove test file if currently existing
    removeFile(testFile)

    fs.appendFileSync(testFile, "go down and enter by doubt")

    const variables = [
        {
            name: "down",
            value: "up"
        },
        {
            name: "doubt",
            value: "faith"
        },
    ]

    // run text replace
    await replaceTextOccurrencesWhere(testFile, variables).then((path) => {
        // read file content to memory
        const contents = String(fs.readFileSync(path))

        // clean up file after reading content
        removeFile(path)

        // check updated content of the file
        expect(contents).toBe("go up and enter by faith")
    })
})