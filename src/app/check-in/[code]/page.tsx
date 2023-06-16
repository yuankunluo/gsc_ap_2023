import { UploadData } from "@/app/admin/handler"
import sql, { peopleCheckInTable } from "@/lib/db"
import TableCard from "./tableCard"
import NoCode from "./notCode"
import { getNowTs } from "@/utils"



async function checkIn(code: string){

    try {
        const record = await sql<UploadData[]>`
            SELECT * FROM ${sql(peopleCheckInTable)}
            WHERE code = ${ code }
        `
        console.debug("found", record)

        
        if (record.length == 1){
            
            if (!record[0].check_in){
                // Found and CheckIn
                await sql`
                UPDATE ${sql(peopleCheckInTable)} 
                SET check_in = timezone('utc'::text, now())
                WHERE code = ${ code } 
                `
                const result = await sql<UploadData[]>`
                SELECT * FROM ${sql(peopleCheckInTable)}
                WHERE code = ${ code }
                `
                
                return result[0]

            } else {
                return record[0]
            }

        } else if (record.length == 0){
            return null
        } else {
            throw new Error("Multiple record found for one code")
        }

    } catch(error){
        console.error(error)
        throw new Error("DB error")
    }
}



export default async function CheckInWithId(
    {params}: {
        params: {code: string}
    }
){

    const data = await checkIn(params.code)


    return (
        <div>
            { data? 

                <TableCard data={data} />                

                :
                <NoCode />
            }
        </div>
    )
}