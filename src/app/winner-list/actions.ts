'use server'

import sql, { winnerListTable } from "@/lib/db"
import { WinnerListData } from "../admin/actions"
import { WinnerAddressData } from "./page"
import { sha256 } from 'js-sha256';


export interface PrizeListResponse {
    prizeList?: string[]
    error?: string
}

export interface HandleSubmitResponse {
    data?: WinnerListData
    error?: string
}


export async function getPrizeList(){

    const result: PrizeListResponse = {}

    try {
        const data = await sql<WinnerListData[]>`
            SELECT prize
            FROM ${sql(winnerListTable)}
            GROUP BY prize
        `


        result.prizeList = data.map(d => d.prize)
        
    } catch (error){
        console.error(error)
        result.error = '获取奖品列表失败'
    }
    return result
}

class AddressError extends Error {

    constructor(message: string){
            super(message);
            this.name = "AddressError"
        }
    
}

export async function handleUploadAddress(data: WinnerAddressData){
    const response: HandleSubmitResponse = {}

    const hash_code = sha256(`${data.staff_id}${data.prize}${data.code.toUpperCase()}`)
    console.log(hash_code)
    try {
        const record = await sql<WinnerAddressData[]>`
            SELECT *
            FROM ${sql(winnerListTable)}
            WHERE hash_code = ${hash_code}
        `
        if (record.length == 1){

            if (record[0].address){
                throw new AddressError("不能再进行修改！")
            }

            const update = await sql`
            UPDATE ${sql(winnerListTable)}
            SET name=${data.name}, phone = ${data.phone}, address = ${data.address}, update_at = timezone('utc'::text, now())
            WHERE hash_code = ${hash_code}
            `
            const result = await sql<WinnerListData[]>`
            SELECT *
            FROM ${sql(winnerListTable)}
            WHERE hash_code = ${hash_code} 
            `
            response.data = result[0]
        } else {
            throw new AddressError("找不到记录")
        }
        
    } catch(error){
        console.error(error)
        if (error instanceof AddressError){
            response.error = error.message
        } else {
            response.error = '未知错误'
        }
    }

    return response
}