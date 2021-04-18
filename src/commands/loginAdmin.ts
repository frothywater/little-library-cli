import { Command } from "@oclif/command"
import cli from "cli-ux"
import * as fs from "fs"
import { Database } from "little-library"
import * as path from "path"

export default class LoginAdminCommand extends Command {
    static description =
        "Login the MySQL database with identity of administrator"

    async run(): Promise<void> {
        this.log("Login via database administrator")

        const { cacheDir } = this.config
        const infoFilePath = path.join(cacheDir, "./admin.dat")
        await fs.promises
            .access(infoFilePath)
            .then(() => fs.promises.unlink(infoFilePath))
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            .catch((_err) => {})

        const username: string = await cli.prompt("Username")
        const password: string = await cli.prompt("Password", { type: "hide" })
        const database: string = await cli.prompt("Database Name")

        try {
            const db = new Database(username, password, database)
            await db.connect()
            const loginInfoString = `${username}\n${password}\n${database}\n`
            await fs.promises.writeFile(infoFilePath, loginInfoString)
            await db.close()
            this.log("Login success!")
        } catch (err) {
            this.error("Sorry, login failed... Please check your input again.")
        }
    }
}
