'use client'

import { useEffect, useRef, useState, useTransition } from "react"
import { WinnerListData, getWinnerListData } from "../actions"
import { useRouter } from "next/navigation"
import { DataTable } from "primereact/datatable"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { Column } from "primereact/column"
import { convertToDateString } from "@/utils"

export default function WinnerListPage(){

    const [winnerData, setWinnerData] = useState<WinnerListData[]>()
    const [isFetching, startFetching] = useTransition()
    const router = useRouter()
    const dataTable = useRef<DataTable<WinnerListData[]>>(null);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const onGlobalFilterChange1 = (value:string) => {
        
        setGlobalFilterValue1(value);
    } 

    const exportCSV = (selectionOnly:boolean = false) => {
        dataTable.current?.exportCSV({selectionOnly});
    };


    useEffect(()=>{
        if (!winnerData){
            fetchData()
        }
    },[])

    const fetchData = ()=>{
        startFetching(()=>{
            getWinnerListData().then(data=>{
                console.log(data)
                setWinnerData(data)
            }).catch(error =>{
                console.error(error)
            })
        })
    }

    const renderHeader1 = () => {
        return (
            <div className="grid sm:grid-cols-1 gird-cols-2 justify-items-stretch gap-4">
                <Button
                    className="justify-self-start"
                    type="button" 
                    label="返回"
                    severity="info"
                    onClick={()=> router.back()} />

                <div className="flex flex-wrap gap-4 justify-self-end">
                    
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
                        icon="pi pi-refresh" 
                        label="刷新" 
                        severity="info"
                        onClick={()=>{fetchData()}} />


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

    return <>
        return (
        <div className="fixed top-32 bottom-36 left-0 right-0 bg-white w-full">
            <DataTable
                loading={isFetching}
                value={winnerData}
                ref={dataTable}
                scrollable
                stripedRows 
                showGridlines
                scrollHeight="flex" 
                virtualScrollerOptions={{ itemSize: 100 }}
                dataKey="code"
                globalFilterFields={['code', 'phone', 'name']}
                globalFilterMatchMode="contains"
                globalFilter={globalFilterValue1}
                header={header1} 
                emptyMessage="No Record found."
                >
                <Column field="code" header="Code" sortable filter ></Column>
                <Column field="prize" header="Prize" sortable filter ></Column>
                <Column field="name" header="Name" sortable filter></Column>
                <Column field="phone" header="Phone" sortable filter></Column>
                <Column field="address" header="Address" sortable filter></Column>
                <Column
                    sortable
                    body={(rowData: WinnerListData)=>convertToDateString(rowData.inserted_at)
                } header="Insert_At"></Column>
                <Column
                    sortable
                    body={(rowData: WinnerListData)=>convertToDateString(rowData.update_at)
                } header="Update_At"></Column>
            </DataTable>
        </div>
    )
    </>

}