'use client'

import { useRouter } from 'next/navigation';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from "primereact/button";
import { useState } from 'react';

export default function AdminPage(){


    const [activeIndex, setActiveIndex] = useState<number|number[]>()
    const router = useRouter();


    const goToUpload = ()=>{
        router.push('/admin/upload')
    }

    return (
        <div className="w-full grid grid-cols-1 gap-4">
            
            <Accordion activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <AccordionTab header="Upload File">
                    <p>This action will DELETE ALL old record!</p>
                    <Button onClick={() =>  goToUpload()}>Go ToUpload</Button>
                </AccordionTab>
                <AccordionTab header="Header II">
                    Content II
                </AccordionTab>
                <AccordionTab header="Header III">
                    Content III
                </AccordionTab>
            </Accordion>
        </div>


    )
}