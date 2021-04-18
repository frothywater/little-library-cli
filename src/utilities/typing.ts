import { Library } from "little-library"

export interface AdminInfo {
    username: string
    password: string
    database: string
}

export interface ManagerInfo {
    username: string
    password: string
}

export enum SecurityStatus {
    adminNotLoggedIn,
    managerNotLoggedIn,
    error,
    ok,
}

export interface LibraryResult {
    status: SecurityStatus
    library?: Library
}
