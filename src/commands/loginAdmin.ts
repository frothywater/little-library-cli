import { Command } from "@oclif/command"
import cli from "cli-ux"
import { Database } from "little-library"
import { deleteAdminFile, writeAdminFile } from "../utilities/security"

export default class LoginAdminCommand extends Command {
    static description =
        "Login the MySQL database with identity of administrator"

    async run(): Promise<void> {
        this.log("Login via database administrator")

        await deleteAdminFile(this.config.cacheDir)

        const username: string = await cli.prompt("Username")
        const password: string = await cli.prompt("Password", { type: "hide" })
        const database: string = await cli.prompt("Database Name")

        try {
            const db = new Database(username, password, database)
            await db.connect()

            await writeAdminFile(
                { username, password, database },
                this.config.cacheDir
            )

            this.log("Login success!")
            await db.close()
        } catch (err) {
            this.error("Sorry, login failed... Please check your input again.")
        }
    }
}
