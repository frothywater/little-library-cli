import { Command } from "@oclif/command"
import { deleteManagerFile } from "../utilities/security"

export default class LogoutCommand extends Command {
    static description = "Logout Little Library with identity of manager"

    async run(): Promise<void> {
        await deleteManagerFile(this.config.cacheDir)
    }
}
