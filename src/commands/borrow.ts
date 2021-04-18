import { Command, flags } from "@oclif/command"
import { openLibrary } from "../utilities/security"
import { SecurityStatus } from "../utilities/typing"

export default class BorrowCommand extends Command {
    static description = `Borrow a book using a library card.`

    static examples = [`$ little-library borrow 1 2`]

    static flags = { help: flags.help({ char: "h" }) }

    static args = [
        { name: "cardID", required: true },
        { name: "bookID", required: true },
    ]

    async run(): Promise<void> {
        const { args } = this.parse(BorrowCommand)
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
        const cardExists = await library.existCard(cardID)
        if (!cardExists) this.error("Card not found. Please check your input.")
        const bookExists = await library.existBook(bookID)
        if (!bookExists) this.error("Book not found. Please check your input.")
        const alreadyBorrowed = await library.getBorrowStatus(cardID, bookID)
        if (alreadyBorrowed)
            this.error(
                "The book is already borrowed by the owner of the library card."
            )

        try {
            const borrowResult = await library.borrowBook(
                cardID,
                bookID,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                result.manager!.id
            )

            if (borrowResult.success) this.log("Success!")
            else
                this.log(`Out of stock. It's estimated that the earliest date
when the book will be available is ${borrowResult.estimatedAvailableDate?.toLocaleDateString()}`)

            await library.close()
        } catch {
            return this.error("Something wrong... Please reach for admin.")
        }
    }
}
