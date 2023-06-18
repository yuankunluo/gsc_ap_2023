'use server'

import sql, { checkInCodeTable, checkInTabble } from "@/lib/db";
import { CheckInCodeData, CheckInData, isCheckInCodeExpired } from "../admin/actions";


class CheckInError extends Error {
    constructor(message: string){
        super(message);
        this.name = "CheckInError"
    }
}


export interface CheckInResponse {
    checkInData?: CheckInData
    errorMessage?: string
}


export async function handleCheckIn(code: string, checkInCode: string){


    code = code.toLocaleLowerCase()
    checkInCode = checkInCode.toLocaleLowerCase()

    const response: CheckInResponse = {}

    try {


        // TODO: CheckInCode validation

        const expired = await isCheckInCodeExpired(checkInCode)

        if (expired){
            throw new CheckInError("签到码无效")
        }

        const checkInRecords = await sql<CheckInData[]>`
            SELECT * FROM ${sql(checkInTabble)}
            WHERE code = ${ code }
        `
        console.debug("found checkInRecords", checkInRecords)

        if (checkInRecords.length == 0){
            throw new CheckInError("我们没有找到你的坐席，请联系组委会成员查询。")
        }

        if (checkInRecords.length > 1){
            throw new CheckInError("我们查到多条坐席属于你，请联系组委会成员确认。")
        }

        if (checkInRecords[0].check_in){
            throw new CheckInError("你已经完成签到，请勿重复操作。")
        }

        
        

        const checkInCodeRecords = await sql<CheckInCodeData[]>`
            SELECT * FROM ${sql(checkInCodeTable)}
            WHERE code = ${checkInCode} AND used_by is NULL
        `

        console.debug('found checkInCodeRecords', checkInCodeRecords)

        if (checkInCodeRecords.length == 0){
            throw new CheckInError("签到码无效。")
        }

        // Updata CheckIn
        const updatedCheckIn = await sql`
                UPDATE ${sql(checkInTabble)} 
                SET check_in = timezone('utc'::text, now()), 
                    update_at = timezone('utc'::text, now()),
                    check_in_code = ${checkInCode}
                WHERE code = ${ code } 
                `
        console.debug("updated", updatedCheckIn)
        
        // Update CheckInCode
        const updatedCheckInCode = await sql`
            UPDATE ${sql(checkInCodeTable)}
            SET used_by = ${code}, updated_at = timezone('utc'::text, now())
            WHERE code = ${checkInCode}
        `
        
        console.debug("updatedCheckInCode", updatedCheckInCode)

        const result = await sql<CheckInData[]>`
        SELECT * FROM ${sql(checkInTabble)}
        WHERE code = ${ code }
        `
        response.checkInData = result[0]

    } catch(error){
        console.error(error)
        if (error instanceof CheckInError){
            response.errorMessage = error.message
        } else {
            response.errorMessage = "未知错误,请联系系统管理员"
        }
    }

    return response
}