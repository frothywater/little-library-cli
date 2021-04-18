import { Command, flags } from "@oclif/command"
import cli from "cli-ux"
import { BookRow, BookSearchParams } from "little-library"
import { openLibrary } from "../utilities/security"
import { SecurityStatus } from "../utilities/typing"

const sortingKeys = ["title", "author", "press", "category", "year", "price"]

export default class SearchBookCommand extends Command {
    static description = `Search books conforming to a certain series of conditions.
        Results are limited to 50 books.`

    static examples = [
        `$ little-library searchBook --title="Alice in Wonderland"`,
    ]

    static flags = {
        title: flags.string({ char: "t", description: "Keyword in title" }),
        author: flags.string({
            char: "a",
            description: "Keyword in author's name",
        }),
        press: flags.string({
            char: "p",
            description: "Keyword in press' name",
        }),
        category: flags.string({
            char: "c",
            description: "Keyword in category",
        }),
        minYear: flags.integer({ description: "Minimum publication year" }),
        maxYear: flags.integer({ description: "Maximum publication year" }),
        minPrice: flags.integer({
            description: "Minimum price",
            parse: (str) => parseFloat(str),
        }),
        maxPrice: flags.integer({
            description: "Maximum price",
            parse: (str) => parseFloat(str),
        }),
        sorting: flags.string({
            char: "s",
            description: "Sorting key",
            options: sortingKeys,
        }),
        order: flags.string({
            char: "o",
            description: "Sorting order",
            options: ["asc", "desc"],
            default: "asc",
        }),
    }

    async run(): Promise<void> {
        const { flags } = this.parse(SearchBookCommand)
        const {
            title,
            author,
            press,
            category,
            minYear,
            maxYear,
            minPrice,
            maxPrice,
            sorting,
            order,
        } = flags

        const searchParams: BookSearchParams = {
            title,
            author,
            press,
            category,
            year: [minYear, maxYear],
            price: [minPrice, maxPrice],
        }

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
            const bookRows = await library.searchBook(
                searchParams,
                sorting as keyof BookRow | undefined,
                order == "asc"
            )

            cli.table(bookRows, {
                id: {},
                title: {},
                author: {},
                press: {},
                category: {},
                year: {},
                price: { get: (row) => row.price.toFixed(2) },
                total: {},
                stock: {},
            })

            await library.close()
        } catch {
            return this.error("Something wrong... Please reach for admin.")
        }
    }
}
