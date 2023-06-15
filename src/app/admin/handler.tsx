'use server'

import sql from "@/lib/db"


export async function handleUpload(data: string, password:string){
    console.log(password)
    // console.log(data)

    const db_data = await sql`SELECT * FROM check_in_list`;

    console.log(db_data);
    
    return {
        "message":"ok"
    }
}