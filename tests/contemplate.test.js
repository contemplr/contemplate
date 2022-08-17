const SRC_TEMPLATE_REPOSITORY = "https://github.com/developersunesis/springboot-auth-jwt.git"
const {configFromJSON, contemplate} = require("../index");

test("fails reading variables file because it's missing", () => {
    return expect(() => configFromJSON("./missingFolder")).toThrow()
})

test("success reading variables file", () => {
    return expect(() => configFromJSON("./sample")).toBeDefined()
})

test("success reading specified variables file from json", () => {
    return expect(() => configFromJSON("./sample").variables).toBeDefined()
})

test("success reading specified variables file from json", () => {
    return expect(() => configFromJSON("./sample").variables).toBeDefined()
})