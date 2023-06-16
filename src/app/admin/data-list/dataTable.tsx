'use client'

import { Column } from "primereact/column";
import { UploadData } from "../handler";
import { DataTable } from 'primereact/datatable';
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import moment from "moment";

export function DataTableComp(props: {data: UploadData[]}){

    const DATE_FORMAT= "YYYY-MM-DD HH:mm:ss"

    const formatDate = (value: Date) => {
        return `${value}`
    }

    const [globalFilterValue1, setGlobalFilterValue1] = useState('');

    const dateTemplate = (rowData:UploadData)=>{
        return <p>rowData.name</p>
    }

    const clearFilter1 = () => {
        initFilters1();
    }

    const initFilters1 = () => {
        setGlobalFilterValue1('');
    }

    const onGlobalFilterChange1 = (value:string) => {
        
        setGlobalFilterValue1(value);
    } 

    const renderHeader1 = () => {
        return (
            <div className="flex flex-row justify-end">
                <Button 
                    type="button" 
                    icon="pi pi-filter-slash" 
                    label="Clear" 
                    className="p-button-outlined" onClick={clearFilter1} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText 
                        value={globalFilterValue1} 
                        onChange={e => onGlobalFilterChange1(e.target.value)} 
                        placeholder="Keyword Search" />
                </span>
            </div>
        )
    }

    const header1 = renderHeader1();

    return (
        <div className="fixed top-32 bottom-36 left-0 right-0 bg-white w-full">
            <DataTable value={props.data}
                scrollable
                stripedRows 
                showGridlines
                scrollHeight="flex" 
                virtualScrollerOptions={{ itemSize: 100 }}
                dataKey="code"
                globalFilterFields={['code', 'table', 'name']}
                globalFilterMatchMode="contains"
                globalFilter={globalFilterValue1}
                header={header1} emptyMessage="No Record found."
                >
                <Column field="code" header="Code" sortable filter ></Column>
                <Column field="table_nr" header="Table Nr" sortable filter></Column>
                <Column field="check_in"
                    sortable
                    body={(rowData: UploadData)=>{
                        if (rowData.check_in){
                            return <>{moment(rowData.check_in).format(DATE_FORMAT)}</>
                        } else {
                            return ''
                        }
                }} header="Created In"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="inserted_at" body={(rowData: UploadData)=>{
                    return <>{moment(rowData.inserted_at).format(DATE_FORMAT)}</>
                }} header="Created In"></Column>
            </DataTable>
        </div>
    )

}