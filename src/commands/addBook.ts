import { Command, flags } from "@oclif/command"
import * as fs from "fs"
import { BookInfo } from "little-library"
import { openLibrary } from "../utilities/security"
import { SecurityStatus } from "../utilities/typing"

const badFormatMessage = "Bad format. Please refer to --help."
const lineRegex = /^\((([^\s",]+|".*"),\s?){6}([^\s",]+|".*")\)$/
const partRegex = /((?<=").+(?="))|[^\s",]+/g

export default class AddBookCommand extends Command {
    static description = `Add a library card.
Apart from input on console, using a file containing information of the books is also supported.
File should only contain several lines, which should be formatted by:
(TITLE, AUTHOR, PRESS, CATEGORY, YEAR, PRICE, COUNT)`

    static examples = [
        `$ little-library addBook "Guide to Cook Boiled Egg" Jim Penguin Bestseller 2020 10.00 5`,
    ]

    static flags = {
        help: flags.help({ char: "h" }),
        file: flags.string({
            char: "f",
            description: "Path to the file containing information of the books",
        }),
    }

    static args = [
        { name: "title" },
        { name: "author" },
        { name: "press" },
        { name: "category" },
        { name: "year" },
        { name: "price" },
        { name: "count" },
    ]

    async run(): Promise<void> {
        const { flags, args } = this.parse(AddBookCommand)
        const { file: filePath } = flags

        const books = filePath
            ? await this.readFile(filePath)
            : [this.parseBook(args)]

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
            await library.addBooks(books)

            await library.close()
        } catch {
            return this.error("Something wrong... Please reach for admin.")
        }
    }

    private parseBook(args: { [name: string]: string }): BookInfo {
        const {
            title,
            author,
            press,
            category,
            year: yearStr,
            price: priceStr,
            count: countStr,
        } = args

        const year = parseInt(yearStr, 10)
        if (!year)
            this.error("Year should be a number. Please check your input.")
        const price = parseFloat(priceStr)
        if (!price || price < 0)
            this.error(
                "Price should be a non-negative number. Please check your input."
            )
        const count = parseInt(countStr, 10)
        if (!count || count < 0)
            this.error(
                "Count should be a non-negative number. Please check your input."
            )

        return { title, author, press, category, year, price, count }
    }

    private async readFile(path: string): Promise<BookInfo[]> {
        const fileString = await fs.promises
            .readFile(path)
            .then((buffer) => buffer.toString())
            .catch((_err) =>
                this.error("Cannot read file. Please check your file.")
            )
        const lines = fileString.split("\n")
        if (lines.length === 0) this.error(badFormatMessage)

        return lines
            .filter((line) => line !== "")
            .map((line) => {
                if (!lineRegex.test(line)) this.error(badFormatMessage)
                const matchResult = line
                    .slice(1, line.length - 1)
                    .match(partRegex)
                if (matchResult?.length !== 7) this.error(badFormatMessage)
                const [
                    title,
                    author,
                    press,
                    category,
                    yearStr,
                    priceStr,
                    countStr,
                ] = matchResult
                const year = parseInt(yearStr, 10)
                const price = parseFloat(priceStr)
                const count = parseInt(countStr, 10)
                if (!year || !price || !count) this.error(badFormatMessage)
                return { title, author, press, category, year, price, count }
            })
    }
}
