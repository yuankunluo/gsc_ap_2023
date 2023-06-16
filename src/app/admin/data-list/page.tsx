import { getAllData } from "../handler"
import { DataTableComp } from "./dataTable";



export default async function DataListPage(){

    const data = await getAllData();

    return (
        <DataTableComp data={data} />
    )
}