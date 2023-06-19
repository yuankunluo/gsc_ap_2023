'use client'

import { Column } from "primereact/column";
import { CheckInData } from "../actions";
import { DataTable } from 'primereact/datatable';
import { Button } from "primereact/button";
import { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { convertToDateString } from "@/utils";
import { useRouter } from "next/navigation";

export function DataTableComp(props: {data: CheckInData[]}){

    const router = useRouter()
    const dataTable = useRef<DataTable<CheckInData[]>>(null);

    const [globalFilterValue1, setGlobalFilterValue1] = useState('');


    const onGlobalFilterChange1 = (value:string) => {
        
        setGlobalFilterValue1(value);
    } 

    const renderHeader1 = () => {
        return (
            <div className="grid grid-cols-2 justify-items-stretch gap-4">
                <Button
                    className="justify-self-start"
                    type="button" 
                    label="返回"
                    severity="info"
                    onClick={()=> router.back()} />

                <div className="justify-self-end">
                    
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText 
                            value={globalFilterValue1} 
                            onChange={e => onGlobalFilterChange1(e.target.value)} 
                            placeholder="任意字符搜索" />
                    </span>


                    <Button 
                        className="m-4"
                        type="button" 
                        icon="pi pi-file" 
                        label="下载" 
                        severity="info"
                        data-pr-tooltip="CSV"
                        onClick={()=>{exportCSV()}} />
                </div>
                
            </div>
        )
    }

    const header1 = renderHeader1();


    const exportCSV = (selectionOnly:boolean = false) => {
        dataTable.current?.exportCSV({selectionOnly});
    };

    return (
        <div className="fixed top-32 bottom-36 left-0 right-0 bg-white w-full">
            <DataTable 
                value={props.data}
                ref={dataTable}
                scrollable
                stripedRows 
                showGridlines
                scrollHeight="flex" 
                virtualScrollerOptions={{ itemSize: 100 }}
                dataKey="id"
                globalFilterFields={['code', 'table', 'name']}
                globalFilterMatchMode="contains"
                globalFilter={globalFilterValue1}
                header={header1} 
                emptyMessage="No Record found."
                >
                <Column field="id" header="ID" sortable filter ></Column>
                <Column field="code" header="Code" sortable filter ></Column>
                <Column field="table_nr" header="Table Nr" sortable filter></Column>
                <Column field="check_in"
                    sortable
                    body={(rowData: CheckInData)=>convertToDateString(rowData.check_in)
                        
                } header="Check In"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="history" header="Hisotry"></Column>
                <Column field="update_at" header="UpdatedAt"
                    sortable
                    body={(rowData: CheckInData)=>convertToDateString(rowData.update_at)}
                    ></Column>
                {/* <Column field="inserted_at" body={(rowData: UploadData)=>{
                    return <>{convertToDateString(rowData.inserted_at)}</>
                }} header="Created"></Column> */}
            </DataTable>
        </div>
    )

}