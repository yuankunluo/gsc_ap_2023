import sql, { checkInCodeTable } from "@/lib/db"
import { makeid } from "@/utils"
import { PostgresError } from "postgres"


async function generateCheckInCode(){

    try {
        const deleted = await sql`DELETE FROM ${sql(checkInCodeTable)} WHERE code != ''`
        console.debug("deleted", deleted)
    } catch (error){
        console.error(error)

        if (error instanceof PostgresError){
            if (error.message.includes('does not exist')){
                                
                const created = await sql`CREATE TABLE ${sql(checkInCodeTable)} (
                    id bigint generated by default as identity primary key,
                    inserted_at TIMESTAMP with time zone default timezone('utc'::text, now()) NOT NULL,
                    code TEXT NOT NULL
                )
                `
                console.debug("created: ", created)

            }
            else {
                throw error
            }
        } else {
            throw error;
        }
    }


    try {
        const codes = Array(1000).fill(1).map((x,y) => {
            return {
                code: makeid(4).toLocaleLowerCase()
            }
        })

        const inserted = await sql`
        INSERT INTO ${sql(checkInCodeTable)} ${sql(codes)}
        `

        return inserted

    } catch(error){
        throw error
    }
    
}





export default async function GenerateCheckInCode(){

    const inserted = await generateCheckInCode()

    return <p className="p-card p-4">已经生成了随机1000条签到码</p>

}