'use client'

import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import CheckInCode from '../component/checkInCode';
import { useRouter } from 'next/navigation';



export default function CheckInPage(){

    const [value, setValue] = useState("")
    const [visible, setVisible] = useState(false)
    const router = useRouter()

    const goSignIn = (value: string) => {
        router.push(`/check-in/${value}`)
    }

    const toggle = () => {
        setVisible(!value)
    }

    return (
        
        <div className="grid grid-cols-1 gap-4">
            
            <h1>请输入你的<Chip label='入场码(?)' onClick={(e)=>{toggle()}}/>，然后点击签到</h1>

            <CheckInCode visible={visible} setVisible={setVisible} />

            <InputText placeholder="输入你的入场码" value={value} onChange={(e) => {
                setValue(e.target.value);
            }} />
            <Button severity='success' disabled={value === ""} onClick={(e) => goSignIn(value)}>签到</Button>
            <Button onClick={(e) => {router.back()}} severity="info">返回</Button>
        </div>
    )
}

