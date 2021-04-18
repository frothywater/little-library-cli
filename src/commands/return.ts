import { Command, flags } from "@oclif/command"
import { openLibrary } from "../utilities/security"
import { SecurityStatus } from "../utilities/typing"

export default class ReturnCommand extends Command {
    static description = `Return a book using a library card.`

    static examples = [`$ little-library return 1 2`]

    static flags = { help: flags.help({ char: "h" }) }

    static args = [
        { name: "cardID", required: true },
        { name: "bookID", required: true },
    ]

    async run(): Promise<void> {
        const { args } = this.parse(ReturnCommand)
        const {
            cardID: cardIDString,
            bookID: bookIDString,
        }: { [name: string]: string } = args
        const cardID = parseInt(cardIDString, 10)
        if (!cardID)
            this.error("Card ID should be a number. Please check your input.")
        const bookID = parseInt(bookIDString, 10)
        if (!cardID)
            this.error("Book ID should be a number. Please check your input.")

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
        const alreadyBorrowed = await library.getBorrowStatus(cardID, bookID)
        if (!alreadyBorrowed)
            this.error(
                "The book is not borrowed by the owner of the library card."
            )

        try {
            await library.returnBook(cardID, bookID)
            this.log("Success!")

            await library.close()
        } catch {
            return this.error("Something wrong... Please reach for admin.")
        }
    }
}
