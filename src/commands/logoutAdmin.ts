import { Command } from "@oclif/command"
import { deleteAdminFile } from "../utilities/security"

export default class LogoutAdminCommand extends Command {
    static description =
        "Logout the MySQL database with identity of administrator"

    async run(): Promise<void> {
        await deleteAdminFile(this.config.cacheDir)
    }
}
