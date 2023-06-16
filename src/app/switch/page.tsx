'use client'

import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Chip } from 'primereact/chip';
import { ConfirmDialog } from 'primereact/confirmdialog'; // To use <ConfirmDialog> tag
import { confirmDialog } from 'primereact/confirmdialog'; 
import { Card } from 'primereact/card';


export default function SwitchPage(){

    const [myCode, setMyCode] = useState("")
    const [hisCode, setHisCode] = useState("")
    const router = useRouter()

    const comfirmSwitch = () => {
        confirmDialog({
            message: `你自愿放弃你的坐席，并将此转让给对方。操作后，你将失去坐席，也不能再进行转让。`,
            header: '确认转让吗？',
            acceptLabel: "是的，我确定转让",
            rejectLabel: "取消",
            accept: () => {

                router.push(`/switch/${myCode}/${hisCode}`)
            },
            reject: () => {}
        });
    }


    const header = (
        <div className="grid grid-cols-1">
            <img className="h-30" alt="Card" src="/girl_ball.png" />
        </div>
    );

    const footer = <div className='grid grid-cols-2 gap-4'>
        <Button onClick={()=>router.back()}>返回</Button>
        <Button
            severity='success'
            disabled={myCode == '' || hisCode == ''}
            icon="pi pi-check" 
            iconPos='right'
            label='转让'
            onClick={()=>comfirmSwitch()}>
               
        </Button>
    </div>



    return (
        
        <div className="grid grid-cols-1 gap-4 p-4">

            <Card
            header={header}
            title="转让坐席给他人"
            subTitle="将爱传递给其他人！"
            footer={footer}
            >

                <div className='grid grid-cols-1 gap-4'>
                    <div className="col-12 md:col-4">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-heart"></i>
                            </span>
                            <InputText placeholder="你的入场码" value={myCode} onChange={(e) => setMyCode(e.target.value)}/>
                        </div>
                    </div>

                    <div className="col-12 md:col-4">
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-heart-fill"></i>
                            </span>
                            <InputText placeholder="对方的入场码" value={hisCode} onChange={(e) => setHisCode(e.target.value)}/>
                        </div>
                    </div>
                </div>
                    
   
            </Card>

            <ConfirmDialog />

        </div>
    )
}

