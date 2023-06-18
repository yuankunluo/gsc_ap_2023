'use server'

import sql, { checkInCodeTable, checkInTabble , partyCodeTable} from "@/lib/db"
import { makeid } from "@/utils"
import { PostgresError } from "postgres"


export type UploadFileType = 'CheckIn' | 'PartyCode'

export interface PartyCodeData {
    code: string
}
export interface CheckInData extends PartyCodeData{
    id?: number,
    table_nr: string
    seat_nr?: string
    name?: string
    check_in?: string
    inserted_at?: string
    update_at?: string
    history?: string
}

export interface GenerateCheckInCodeResponse {
    errorMessage?: string
    count?: number
}

export interface SqlCount {
    count: number
}

export interface CheckInCodeData {
    id?: number
    code: string
}


export interface CheckInCodeResponse {
    codes?: CheckInCodeData[]
    errorMessage?: string
}

export async function create_party_code_table(){
    try{
        const deletedPartyCode = await sql`DELETE FROM ${sql(partyCodeTable)} WHERE code != ''`;
        console.debug("deleted", deletedPartyCode)

    } catch(error){
        if (error instanceof PostgresError){
            if (error.message.includes('does not exist')){
                                
                const createPartyCode = await sql`CREATE TABLE ${sql(partyCodeTable)} (
                    code TEXT primary key NOT NULL
                )
                `
                console.debug("created: ", createPartyCode)

            }
            else {
                throw error
            }
        } else {
            throw error
        }
    }
}


export async function create_checkin_table(){


    try {
        // DELETE ALL RESULT
        const deletedCheckin = await sql`DELETE FROM ${sql(checkInTabble)} WHERE code != ''`;
        console.debug("deleted", deletedCheckin)
    } catch (error){
        if (error instanceof PostgresError){
            if (error.message.includes('does not exist')){
                console.debug("create table", checkInTabble)
                // CREATE TABLE
                const createdCheckInTable = await sql`CREATE TABLE ${sql(checkInTabble)} (
                    id bigint generated by default as identity primary key,
                    code TEXT UNIQUE NOT NULL,
                    table_nr TEXT NOT NULL,
                    inserted_at TIMESTAMP with time zone default timezone('utc'::text, now()) NOT NULL,
                    seat_nr TEXT,
                    name TEXT,
                    history TEXT,
                    check_in TIMESTAMP with time zone default timezone('utc'::text, null),
                    update_at TIMESTAMP with time zone default timezone('utc'::text, null)
                )
                `
                console.debug("created: ", createdCheckInTable)
            }
            else {
                throw error
            }
        } else {
            throw error
        }
    }
}



async function insertCheckInData(checkInData: CheckInData[]){

    try {
        const insertCheckIn = await sql`
        INSERT INTO ${sql(checkInTabble)} ${sql(checkInData)}
        `
        return {"ok":200}
    } catch(error) {
        throw error;
    }
   
}

async function insertPartyCodeData(partyCodeData: PartyCodeData[]){

    const cleanData: PartyCodeData[] = partyCodeData.map(d => ({
        code: d.code
    })) 
    try {
       

        const insertPartyCode =  await sql`
        INSERT INTO ${sql(partyCodeTable)} ${sql(cleanData)}
        `
    
        return {"ok":200}
    } catch(error) {
        throw error;
    }
   
}


export async function handleUploadCheckIn(uploadData: CheckInData[],  password:string){
    console.debug('password', password)
    // console.log(data)

    const masterPassword = `${process.env.MASTER_PASSWORD}`

    if (password !== masterPassword){
        throw new Error("Password invalid")
    }

    await create_checkin_table()
    const insertResult = await insertCheckInData(uploadData)
    console.debug("insert", insertResult)
}


export async function handleUploadPartyCode(uploadData: PartyCodeData[],  password:string){
    console.debug('password', password)
    // console.log(data)

    const masterPassword = `${process.env.MASTER_PASSWORD}`

    if (password !== masterPassword){
        throw new Error("Password invalid")
    }

    await create_party_code_table()
    const insertResult = await insertPartyCodeData(uploadData)
    console.debug("insert", insertResult)
}


export async function getAllData(){
    const data = await sql<CheckInData[]>`SELECT * FROM ${sql(checkInTabble)}`

    return data
}

export async function getCheckInCode(){
    const checkInCodeResponse: CheckInCodeResponse = {}

    try {
        const data = await sql<CheckInCodeData[]>`
        SELECT * FROM ${sql(checkInCodeTable)}
        `
        checkInCodeResponse.codes = data
    } catch(error){
        console.error(error)
        checkInCodeResponse.errorMessage = "错误"
    }
    return checkInCodeResponse
}

export async function generateCheckInCode(){

    const response: GenerateCheckInCodeResponse = {

    }

    try {
        const deleted = await sql`DELETE FROM ${sql(checkInCodeTable)} WHERE code != ''`
        console.debug("deleted", deleted)
    } catch (error){
        console.error(error)

        if (error instanceof PostgresError && error.message.includes('does not exist')){
              
            const created = await sql`CREATE TABLE ${sql(checkInCodeTable)} (
                id bigint generated by default as identity primary key,
                inserted_at TIMESTAMP with time zone default timezone('utc'::text, now()) NOT NULL,
                code TEXT NOT NULL
            )
            `
            console.debug("created: ", created)
         
        } else {
            response.errorMessage = "Failed to Create tabele"
        }
    }

    const limit = process.env.MAX_TABLE_SIZE ? parseInt(process.env.MAX_TABLE_SIZE) : 1000
    
    try {
        const codes = Array(limit).fill(1).map((x,y) => {
            return {
                code: makeid(4).toLocaleLowerCase()
            }
        })

        const inserted = await sql`
        INSERT INTO ${sql(checkInCodeTable)} ${sql(codes)}
        `

        console.debug("inserted", inserted)


        const dataCount = await sql<SqlCount[]>`
            SELECT count(*) FROM ${sql(checkInCodeTable)}
        `
        console.debug( 'dataCount', dataCount)
        response.count = dataCount[0].count
    } catch(error){
        console.error( error)
        response.errorMessage = '数据写入错误'
    }
    return response
}