const SRC_TEMPLATE_REPOSITORY = "https://github.com/developersunesis/springboot-auth-jwt.git"
const {cloneRepository, fetchFolderName} = require("../git.index");
const fs = require("fs");

test("fails if url is invalid", async () => {
    await expect(cloneRepository({
        git: {
            url: "https://errorurl"
        }
    })).rejects.toThrow()

    await expect(cloneRepository({
        git: {
            url: "ht://errorurl."
        }
    })).rejects.toThrow()
})

test("fails if git repository url is invalid", async () => {
    return expect(cloneRepository({
        git: {
            url: "https://github.com/developersunesis/springboot-au"
        }
    })).rejects.toThrow()
})

test("fails if command args is invalid", async () => {
    return expect(cloneRepository({
        git: {
            url: "https://github.com/developersunesis/springboot-au",
            args: null
        }
    })).rejects.toThrow()
})

test("successfully fetch folder name", async () => {
    expect(fetchFolderName("https://github.com/developersunesis/springboot-au", null))
        .toBe("springboot-au")

    expect(fetchFolderName("https://github.com/developersunesis/springboot-au",
        ['example'])).toBe("example")
})

test("successfully clone git repository url into custom folder [example]", async () => {
    const iProps = {
        git: {
            url: SRC_TEMPLATE_REPOSITORY,
            args: ["example"]
        }
    }

    // remove `example` folder if currently exists
    fs.rmSync("./example", { recursive: true, force: true });

    return cloneRepository(iProps).then(res => {
        const {props} = res
        expect(props).toBe(iProps) // returned props is similar to the props passed

        const { url, args } = props.git
        expect(args).toBe(iProps.git.args) // returned props arg is similar to input

        const folderName = fetchFolderName(url, args)

        // validate cloned template repository folder exists
        expect(fs.existsSync(`./${folderName}`)).toBe(true)

        // validate .git directory in the cloned template does not exist
        expect(fs.existsSync(`./${folderName}/.git`)).toBe(false)

        // remove `example` folder after testing
        fs.rmSync("./example", { recursive: true, force: true });
    })
})