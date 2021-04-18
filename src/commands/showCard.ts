import { Command, flags } from "@oclif/command"
import { printBooks } from "../utilities/console"
import { openLibrary } from "../utilities/security"
import { SecurityStatus } from "../utilities/typing"

export default class ShowCardCommand extends Command {
    static description = `Show the borrowed books under a card.`

    static examples = [`$ little-library showCard 1`]

    static flags = { help: flags.help({ char: "h" }) }

    static args = [{ name: "cardID", required: true }]

    async run(): Promise<void> {
        const { args } = this.parse(ShowCardCommand)
        const { cardID: cardIDString }: { [name: string]: string } = args
        const cardID = parseInt(cardIDString, 10)
        if (!cardID)
            this.error("Card ID needs to be a number. Please check your input.")

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
        const cardExists = await library.existCard(cardID)
        if (!cardExists) this.error("Card not found. Please check your input.")

        try {
            const bookRows = await library.getBorrowedBooks(cardID)

            printBooks(bookRows)

            await library.close()
        } catch {
            return this.error("Something wrong... Please reach for admin.")
        }
    }
}
