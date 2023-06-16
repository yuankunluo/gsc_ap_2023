import { CheckInData } from "@/app/admin/handler"
import sql, { checkInTabble } from "@/lib/db"
import { PARTY_CODE } from "@/lib/party_code"




async function doSwitch(myCode: string, hisCode: string){

    myCode = myCode.toLocaleLowerCase()
    hisCode = hisCode.toLocaleLowerCase()

    try {
        const data = await sql<CheckInData[]>`
        SELECT * FROM ${sql(checkInTabble)}
        WHERE code = ${myCode.toLocaleLowerCase()}
        ` 
        console.debug("found mine", data)

        if (data.length == 0){
            throw new Error("Can not find your seat")
        }

        const mine = data[0]

        const hisData = await sql<CheckInData[]>`
        SELECT * FROM ${sql(checkInTabble)}
        WHERE code = ${hisCode.toLocaleLowerCase()}
        `

        if (hisData.length != 0){
            throw new Error("Your friend already has a seat!")
        }

        if (!PARTY_CODE.includes(hisCode)){
            throw new Error("Your friend's invitation code is not correct, please make sure your friend has a code!")
        }
        
        if (!mine.history){
            mine.history = mine.code
        }

        const history = `${mine.history} => ${hisCode}`

        const updated = await sql`
        UPDATE ${sql(checkInTabble)} 
        SET code = ${hisCode}, history = ${ history }
        WHERE id = ${ mine.id }  
        `

        console.debug("updated", updated)

        const newData = await sql<CheckInData[]>`
        SELECT * FROM ${sql(checkInTabble)}
        WHERE id = ${mine.id}
        ` 
        return newData[0]
    } catch(error){
        throw error
    }
}


export default async function SwitchCodePage({params}:{
    params: {
        mycode: string,
        hiscode: string
    }
}){

    const reuslt = await doSwitch(params.mycode, params.hiscode)
    
    return <p>
        {params.mycode} = {params.hiscode}, {reuslt.history}
    </p>
}