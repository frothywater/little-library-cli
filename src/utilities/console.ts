import cli from "cli-ux"
import { BookRow } from "little-library"

export function printBooks(bookRows: BookRow[]): void {
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
}
