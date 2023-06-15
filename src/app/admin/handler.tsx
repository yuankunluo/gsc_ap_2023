'use server'

import sql from "@/lib/db"

export interface UploadData {
    code: string
    name: string
    table: string
    seat?: string
}

export async function handleUpload(data: UploadData[], password:string){
    console.log(password)
    // console.log(data)

    const db_data = await sql`SELECT * FROM check_in_list`;

    console.log(db_data);
    
    return {
        "message":"ok"
    }
}