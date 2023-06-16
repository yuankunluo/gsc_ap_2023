'use client'

import Link from 'next/link';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useState } from 'react';
import CheckInList from './checkInList';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';


export default function AdminPage(){

    const router = useRouter()
    const [activeIndex, setActiveIndex] = useState<number|number[]>()

    const goToList = ()=>{
        router.push("/admin/upload")
    }
   

    return (
        <div className="w-full grid grid-cols-1 gap-4">
            
            <Accordion activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <AccordionTab header="Upload File">
                    <p>This action will DELETE ALL old record!</p>
                    <Button security='info' onClick={()=>goToList()}>Go To Upload</Button>
                </AccordionTab>
                <AccordionTab header="Checkin List">
                    <CheckInList />
                </AccordionTab>
                <AccordionTab header="Header III">
                    Content III
                </AccordionTab>
            </Accordion>
        </div>


    )
}