/**
 * Compares the Regex constraints provided against a value
 * @param checks a list of checks/constraints provided against a value
 * @param value the value to be tested against the constraints
 * @returns {any} the result of the test is either true[indicating passed] or error
 */
function isInvalidInput(checks, value){
    if(checks && checks.length > 0) {
        for (let i = 0; i < checks.length; i++) {
            const check = checks[i].check
            const errorMessage = checks[i].error
            if (check && !new RegExp(checks[i]).test(value)) {
                return errorMessage;
            }
        }
    }

    if(!value || value.trim() === ''){
        return "Input should not be empty"
    }

    return true
}

function isValidVariableName(name){
    return name && name.startsWith("contvar") && name !== "contvar"
}

module.exports = {isInvalidInput, isValidVariableName}