'use server'

import sql, { checkInTabble } from "@/lib/db";
import { CheckInData } from "../admin/actions"


export interface CheckSeatResponse {
    checkInData?: CheckInData
    errorMessage?: string
}

class CheckSeatError extends Error {
    constructor(message: string){
        super(message);
        this.name = "CheckInError"
    }
}

export async function hancleCheckSeat(code: string){
    code = code.toLocaleLowerCase()
    const response: CheckSeatResponse = {}

    try {
        const data = await sql<CheckInData[]>`
        SELECT * FROM ${sql(checkInTabble)}
        WHERE code = ${ code }
    `
        console.debug("found", data)

        if (data.length == 0){
            throw new CheckSeatError("我们没有找到你的坐席，请联系组委会成员查询。")
        }

        if (data.length > 1){
            throw new CheckSeatError("我们查到多条坐席属于你，请联系组委会成员确认。")
        }

        response.checkInData = data[0]
    } catch (error) {
        console.error(error)
        if (error instanceof CheckSeatError){
            response.errorMessage = error.message
        } else {
            response.errorMessage = "未知错误,请联系系统管理员"
        }
    }

    return response
} 