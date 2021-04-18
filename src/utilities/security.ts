import * as fs from "fs"
import { Database, Library } from "little-library"
import * as path from "path"
import { AdminInfo, LibraryResult, ManagerInfo, SecurityStatus } from "./typing"

const adminFileName = "./admin.dat"
const managerFileName = "./manager.dat"

function getAdminFilePath(cacheDir: string): string {
    return path.join(cacheDir, adminFileName)
}

function getManagerFilePath(cacheDir: string): string {
    return path.join(cacheDir, managerFileName)
}

export async function deleteAdminFile(cacheDir: string): Promise<void> {
    const adminFilePath = getAdminFilePath(cacheDir)
    await fs.promises
        .access(adminFilePath)
        .then(() => fs.promises.unlink(adminFilePath))
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch((_err) => {})
}

export async function writeAdminFile(
    info: AdminInfo,
    cacheDir: string
): Promise<void> {
    await fs.promises.writeFile(
        getAdminFilePath(cacheDir),
        `${info.username}\n${info.password}\n${info.database}`
    )
}

export async function readAdminFile(
    cacheDir: string
): Promise<AdminInfo | null> {
    try {
        const adminFileString = (
            await fs.promises.readFile(getAdminFilePath(cacheDir))
        ).toString()
        const [username, password, database] = adminFileString.split("\n")
        if (username && password && database)
            return { username, password, database }
        else return null
    } catch {
        return null
    }
}

export async function deleteManagerFile(cacheDir: string): Promise<void> {
    const managerFilePath = getManagerFilePath(cacheDir)
    await fs.promises
        .access(managerFilePath)
        .then(() => fs.promises.unlink(managerFilePath))
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch((_err) => {})
}

export async function writeManagerFile(
    info: ManagerInfo,
    cacheDir: string
): Promise<void> {
    await fs.promises.writeFile(
        getManagerFilePath(cacheDir),
        `${info.username}\n${info.password}`
    )
}

export async function readManagerFile(
    cacheDir: string
): Promise<ManagerInfo | null> {
    try {
        const managerFileString = (
            await fs.promises.readFile(getManagerFilePath(cacheDir))
        ).toString()
        const [username, password] = managerFileString.split("\n")
        if (username && password) return { username, password }
        else return null
    } catch {
        return null
    }
}

export async function openLibrary(cacheDir: string): Promise<LibraryResult> {
    try {
        const adminInfo = await readAdminFile(cacheDir)
        if (!adminInfo) return { status: SecurityStatus.adminNotLoggedIn }
        const {
            username: adminUsername,
            password: adminPassword,
            database,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        } = adminInfo!

        const managerInfo = await readManagerFile(cacheDir)
        if (!adminInfo) return { status: SecurityStatus.managerNotLoggedIn }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { username, password } = managerInfo!

        const db = new Database(adminUsername, adminPassword, database)
        await db.connect()

        const library = new Library(db)
        const success = await library.checkManager(username, password)
        if (!success) return { status: SecurityStatus.managerNotLoggedIn }

        return { status: SecurityStatus.ok, library }
    } catch {
        return { status: SecurityStatus.error }
    }
}
