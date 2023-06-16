'use client'

import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Chip } from 'primereact/chip';
import { ConfirmDialog } from 'primereact/confirmdialog'; // To use <ConfirmDialog> tag
import { confirmDialog } from 'primereact/confirmdialog'; 


export default function CheckInPage(){

    const [myCode, setMyCode] = useState("")
    const router = useRouter()

    const goSignIn = (value: string) => {
        router.push(`/check-in/${value}`)
    }

    const openHelper = () => {
        confirmDialog({
            message: `入场码是工会或者委员会通过内部邮件发送给你的一个与您的STAFF ID绑定的一串字符。`,
            header: '入场码',
            acceptLabel: "我了解了",
            rejectLabel: "我拒绝",
            rejectClassName: "no-show",
            accept: () => {},
            reject: () => {}
        });
    }


    const confirmCheckIn = () => {
        confirmDialog({
            message: '签到之后，你的坐席将被锁定，而且你也不能再进行转让。请您确认你会到场，并点击确定。如果你还不确定能出席，请点击取消',
            header: '你确定签到？',
            acceptLabel: "确定",
            rejectLabel: "取消",
            accept: () => {goSignIn(myCode)},
            reject: () => {}
        });
    }



    return (
        
        <div className="grid grid-cols-1 gap-4 p-4">

            <h1>请输入你的<Chip label='入场码(?)' onClick={(e)=>{openHelper()}}/>，然后点击签到或者进行转让。</h1>
            
            <InputText placeholder="输入你的入场码" value={myCode} onChange={(e) => {
                        setMyCode(e.target.value);
                    }} />
            <Button severity='success' disabled={myCode === ""} onClick={(e) => confirmCheckIn()}>签到锁定</Button>
            
    

            <ConfirmDialog />

        </div>
    )
}

