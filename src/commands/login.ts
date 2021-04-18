import { Command } from "@oclif/command"
import cli from "cli-ux"
import { Database, Library } from "little-library"
import {
    deleteManagerFile,
    readAdminFile,
    writeManagerFile,
} from "../utilities/security"

export default class LoginCommand extends Command {
    static description = "Login Little Library with identity of manager"

    async run(): Promise<void> {
        this.log("Login Little Library")

        await deleteManagerFile(this.config.cacheDir)

        const username: string = await cli.prompt("Username")
        const password: string = await cli.prompt("Password", { type: "hide" })

        const adminInfo = await readAdminFile(this.config.cacheDir)
        if (!adminInfo)
            this.error(
                "Admin isn't logged in. Please reach for database admin."
            )

        const {
            username: adminUsername,
            password: adminPassword,
            database,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        } = adminInfo!
        const db = new Database(adminUsername, adminPassword, database)
        await db.connect()

        const library = new Library(db)
        const success = await library.checkManager(username, password)
        if (success) {
            await writeManagerFile({ username, password }, this.config.cacheDir)
        } else {
            this.error("Sorry, login failed... Please check your input again.")
        }

        this.log("Login success!")
        await db.close()
    }
}
