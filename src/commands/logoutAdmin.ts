import { Command } from "@oclif/command"
import * as fs from "fs"
import * as path from "path"

export default class LogoutAdminCommand extends Command {
    static description =
        "Logout the MySQL database with identity of administrator"

    async run(): Promise<void> {
        const { cacheDir } = this.config
        const infoFilePath = path.join(cacheDir, "./admin.dat")
        await fs.promises
            .access(infoFilePath)
            .then(() => fs.promises.unlink(infoFilePath))
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            .catch((_err) => {})
    }
}
