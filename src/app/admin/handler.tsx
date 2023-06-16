'use server'

import sql from "@/lib/db"
import { PostgresError } from "postgres"

export interface UploadData {
    code: string
    table_nr: string
    seat_nr?: string
    name?: string
    check_in?: string
    inserted_at?: string
}

const peopleCheckInTable = `${process.env.DB_TABLE_PREFIX}_people_check_in`

export async function create_tables(){


    try {
        // DELETE ALL RESULT
        const deleted = await sql`DELETE FROM ${sql(peopleCheckInTable)} WHERE code != ''`;
        console.debug("deleted", deleted)
    } catch (error){
        if (error instanceof PostgresError){
            if (error.message.includes('does not exist')){
                console.debug("create table", peopleCheckInTable)
                // CREATE TABLE
                const data_table = await sql`CREATE TABLE ${sql(peopleCheckInTable)} (
                    code TEXT NOT NULL PRIMARY KEY,
                    table_nr TEXT NOT NULL,
                    inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
                    seat_nr TEXT,
                    name TEXT,
                    check_in TIMESTAMP
                )
                `
            }
            else {
                throw error
            }
        } else {
            throw error
        }
    }
}



async function insertData(data: UploadData[]){


    const result = await sql`
        INSERT INTO ${sql(peopleCheckInTable)} ${sql(data)}
    `

    // for (let i=0; i< data.length; i++){
    //     try {
    //         await sql`
    //             INSERT INTO ${sql(peopleCheckInTable)} (table_nr, code) values 
    //             (${data[i].table}, ${data[i].code})
    //         `
    //         result.succeedRow += 1
    //     } catch(error){
    //         if (error instanceof PostgresError){
    //             result.errors.push(error.message)
    //         }
    //         console.error(error)
    //     }
    // }
    return result
}


export async function handleUpload(data: UploadData[], password:string){
    console.debug('password', password)
    // console.log(data)

    const masterPassword = `${process.env.MASTER_PASSWORD}`

    if (password !== masterPassword){
        throw new Error("Password invalid")
    }

    await create_tables()

    const insertResult = await insertData(data)

    console.log(insertResult)
    
}


export async function getAllData(){
    const data = await sql<UploadData[]>`SELECT * FROM ${sql(peopleCheckInTable)}`

    return data
}