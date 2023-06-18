'use server'

import sql, { checkInTabble, partyCodeTable } from "@/lib/db";
import { CheckInData, PartyCodeData } from "../admin/actions";

class SwitchError extends Error {
    constructor(message:string){
        super(message);
        this.name = "SwitchError"
    }
}


export interface SwitchResponse {
    checkInData?: CheckInData
    errorMessage?: string
}


export async function handleSwitch(myCode: string, hisCode: string){

    myCode = myCode.toLocaleLowerCase()
    hisCode = hisCode.toLocaleLowerCase()

    const response: SwitchResponse = {}

    try {

        if (myCode == hisCode){
            throw new SwitchError("不能自己转让给自己！")
        }

        const data = await sql<CheckInData[]>`
        SELECT * FROM ${sql(checkInTabble)}
        WHERE code = ${myCode.toLocaleLowerCase()}
        ` 
        console.debug("found mine", data)

        if (data.length == 0){
            throw new SwitchError("找不到你的坐席。")
        }

        if (data.length > 1){
            throw new SwitchError("坐席记录重复，请联系管理员。")
        }

        const mine = data[0]

        if (mine.check_in){
            throw new SwitchError("你已经签到了，无法进行坐席转让！")
        }

        
        if (mine.history){
            throw new SwitchError("此坐席已经转让过一次，无法进行坐席转让！")
        }

        const hisData = await sql<CheckInData[]>`
        SELECT * FROM ${sql(checkInTabble)}
        WHERE code = ${hisCode.toLocaleLowerCase()}
        `

        if (hisData.length != 0){
            throw new SwitchError("你的朋友已经有了坐席，不能再被转让!")
        }

        // Check his partycode
        const hisPartyCode = await sql<PartyCodeData[]>`
        SELECT * FROM ${sql(partyCodeTable)}
        WHERE code = ${hisCode.toLocaleLowerCase()}
        `

        if (hisPartyCode.length == 0){
            throw new SwitchError("你朋友的入场码无效！请使用内部邮件发送的有效入场码")
        }

    
        if (!mine.history){
            mine.history = mine.code
        }

        const history = `${mine.history} => ${hisCode}`
        const myId = `${mine.id}`

        await sql`
            UPDATE ${sql(checkInTabble)} 
            SET code = ${hisCode}, history = ${ history }, update_at = timezone('utc'::text, now())
            WHERE id = ${ myId }
        `

        const newData = await sql<CheckInData[]>`
            SELECT * FROM ${sql(checkInTabble)}
            WHERE id = ${myId}
        `

        response.checkInData = newData[0]
    } catch(error){
        console.error(error)
        if (error instanceof SwitchError){
            response.errorMessage = error.message
        } else {
            response.errorMessage = "未知错误,请联系系统管理员"
        }
    }

    return response
}