'use client'

import { Column } from "primereact/column";
import { UploadData } from "../handler";
import { DataTable } from 'primereact/datatable';

export function DataTableComp(props: {data: UploadData[]}){

    const formatDate = (value: Date) => {
        return `${value}`
    }

    const dateTemplate = (rowData:any)=>{
        return <p>rowData.name</p>
    }

    return (
        <div className="fixed top-32 bottom-36 left-0 right-0 bg-black  w-full">
            <DataTable value={props.data}
                scrollable width="200px" scrollHeight="flex" 
                virtualScrollerOptions={{ itemSize: 46 }}
                >
                <Column field="code" header="Code" ></Column>
                <Column field="table" header="Table Nr"></Column>
                <Column field="check_in" header="Checked In" ></Column>
                <Column field="name" header="Name"></Column>
                <Column field="inserted_at" body={dateTemplate} header="Created In"></Column>
            </DataTable>
        </div>
    )

}