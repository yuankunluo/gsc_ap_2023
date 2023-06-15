async function checkIn(code: string){

    if (code == "000"){
        throw new Error("Code is invalid")
    }

    return {
        "table":"01",
        "seat": "01",
        "checked_in_at": "2023-06-15 20:21"
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
            <p>table: {data.table}</p>
        </div>
    )
}