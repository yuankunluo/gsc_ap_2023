'use client'

import { Accordion, AccordionTab } from 'primereact/accordion';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';


export default function AdminPage(){

    const router = useRouter()
    const [activeIndex, setActiveIndex] = useState<number|number[]>()

    const goToList = (segment: string)=>{
        router.push(`/admin/${segment}`)
    }
   

    return (
        <div className="w-full grid grid-cols-1 gap-4">
            
            <Accordion activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <AccordionTab header="Upload File">
                    <p>This action will DELETE ALL old record!</p>
                    <Button security='info' onClick={()=>goToList("upload")}>Go To Upload</Button>
                </AccordionTab>
                <AccordionTab header="Checkin List">
                    <Button security='info' onClick={()=>goToList("data-list")}>Go To Upload</Button>
                </AccordionTab>
                <AccordionTab header="Header III">
                    Content III
                </AccordionTab>
            </Accordion>
        </div>


    )
}