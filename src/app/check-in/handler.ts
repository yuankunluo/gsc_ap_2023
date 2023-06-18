'use server'

import sql, { checkInCodeTable, checkInTabble } from "@/lib/db";
import { CheckInData } from "../admin/handler";


class CheckInError extends Error {
    constructor(message: string){
        super(message);
        this.name = "CheckInError"
    }
}



export async function handleCheckIn(code: string, checkInCode: string){

    code = code.toLocaleLowerCase()
    checkInCode = checkInCode.toLocaleLowerCase()

    try {
        const checkInRecords = await sql<CheckInData[]>`
            SELECT * FROM ${sql(checkInTabble)}
            WHERE code = ${ code }
        `
        console.debug("found", checkInRecords)

        if (checkInRecords.length == 0){
            throw new CheckInError("我们没有找到你的坐席，请联系组委会成员查询。")
        }

        if (checkInCode.length > 1){
            throw new CheckInError("我们查到多条坐席属于你，请联系组委会成员确认。")
        }

 
        const checkInCodeRecords = await sql`
            SELECT code FROM ${sql(checkInCodeTable)}
            WHERE code = ${checkInCode}
        `

        if (checkInCodeRecords.length == 0){
            throw new CheckInError("抱歉， 你的签到码错误。")
        }


        // Updata CheckIn

        const updated = await sql`
                UPDATE ${sql(checkInTabble)} 
                SET check_in = timezone('utc'::text, now())
                WHERE code = ${ code } 
                `
        console.debug("updated", updated)
            
        const result = await sql<CheckInData[]>`
        SELECT * FROM ${sql(checkInTabble)}
        WHERE code = ${ code }
        `
        return result[0]

    } catch(error){
        console.error(error)
        if (error instanceof CheckInError){
            throw error
        } else {
            throw new CheckInError("未知错误,请联系系统管理员")
        }
    }

}