const {configFromJSON} = require("../index");
const {isInvalidInput, isValidVariableName} = require("../utils/inputs");

test("fails reading variables file because it's missing", () => {
    return expect(() => configFromJSON("./missingFolder")).toThrow()
})

test("success reading variables file", () => {
    return expect(() => configFromJSON("./sample")).toBeDefined()
})

test("success reading specified variables file from json", () => {
    return expect(() => configFromJSON("./sample").variables).toBeDefined()
})

test("success reading specified variables file from json and run checks", () => {
    const variables = configFromJSON("./sample").variables
    expect(variables).toBeDefined()

    expect(variables[0].checks.length).toBe(1)
    expect(isInvalidInput(variables[0].checks, "mynameis")).toBe(true)
    expect(isInvalidInput(variables[0].checks, "ajdh09393")).toBe(true)

    expect(variables[1].checks.length).toBe(1)
    expect(isInvalidInput(variables[1].checks, "09393"))
        .toBe("Project name must be only letters")
    expect(isInvalidInput(variables[1].checks, "Abcd"))
        .toBe(true)
})

test("check variable name validity", () => {
    expect(isValidVariableName("contvar_Proj")).toBe(true)
    expect(isValidVariableName("contvarNoUnderScore")).toBe(true)
    expect(isValidVariableName("invalid")).toBe(false)
    expect(isValidVariableName("Example")).toBe(false)
    expect(isValidVariableName("contvar")).toBe(false)
})