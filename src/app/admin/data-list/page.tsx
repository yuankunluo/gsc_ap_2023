import { getAllData } from "../actions"
import { DataTableComp } from "./dataTable";



export default async function DataListPage(){

    const data = await getAllData();

    const MAX_TABLE_SIZE = process.env.MAX_TABLE_SIZE ? parseInt(process.env.MAX_TABLE_SIZE) : 2000

    return (
        <DataTableComp data={data.slice(0,MAX_TABLE_SIZE)} />
    )
}