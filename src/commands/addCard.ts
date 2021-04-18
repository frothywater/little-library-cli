import { Command, flags } from "@oclif/command"
import { CardType } from "little-library"
import { openLibrary } from "../utilities/security"
import { SecurityStatus } from "../utilities/typing"

export default class AddCardCommand extends Command {
    static description = `Add a library card.`

    static examples = [
        `$ little-library addCard Alice "Shibuya, Tokyo" Student`,
    ]

    static flags = { help: flags.help({ char: "h" }) }

    static args = [
        { name: "name", required: true },
        { name: "address", required: true },
        { name: "type", required: true },
    ]

    async run(): Promise<void> {
        const { args } = this.parse(AddCardCommand)
        const {
            name,
            address,
            type: typeStr,
        }: { [name: string]: string } = args
        let type: CardType
        if (typeStr.toLowerCase() == CardType.student.toLowerCase())
            type = CardType.student
        else if (typeStr.toLowerCase() == CardType.teacher.toLowerCase())
            type = CardType.teacher
        else this.error(`Card type should either be "Teacher" or "Student".`)

        const result = await openLibrary(this.config.cacheDir)
        switch (result.status) {
            case SecurityStatus.adminNotLoggedIn:
                return this.error("Admin is not logged in.")
            case SecurityStatus.managerNotLoggedIn:
                return this.error("Manager is not logged in.")
            case SecurityStatus.error:
                return this.error("Something wrong... Please reach for admin.")
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const library = result.library!

        try {
            await library.addCard({ name, address, type })

            await library.close()
        } catch {
            return this.error("Something wrong... Please reach for admin.")
        }
    }
}
