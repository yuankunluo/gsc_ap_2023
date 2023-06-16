import { UploadData } from "@/app/admin/handler"
import sql, { peopleCheckInTable } from "@/lib/db"




async function doSwitch(myCode: string, hisCode: string){
    try {
        const data = await sql<UploadData[]>`
        SELECT * FROM ${sql(peopleCheckInTable)}
        WHERE code = ${myCode.toLocaleLowerCase()}
        ` 
        console.debug("found", data)

    } catch(error){

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
        {params.mycode} = {params.hiscode}
    </p>
}