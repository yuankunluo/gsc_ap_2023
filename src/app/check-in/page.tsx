'use client'

import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Chip } from 'primereact/chip';
import { ConfirmDialog } from 'primereact/confirmdialog'; // To use <ConfirmDialog> tag
import { confirmDialog } from 'primereact/confirmdialog'; 
import { useForm, Controller , SubmitHandler} from 'react-hook-form';
import { Message } from 'primereact/message';
import { invalid } from 'moment-timezone';

interface MyCode {
    myCode: string
}

export default function CheckInPage(){

    const {register, formState:{errors, isValid}, handleSubmit, control} = useForm<MyCode>()
    const router = useRouter()

    const goSignIn = (myCode: MyCode) => {
        router.push(`/check-in/${myCode.myCode}`)
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


    const confirmCheckIn = (myCode: MyCode) => {
        confirmDialog({
            message: '签到之后，你的坐席将被锁定，而且你也不能再进行转让。请您确认你会到场，并点击确定。如果你还不确定能出席，请点击取消',
            header: '你确定签到？',
            acceptLabel: "确定",
            rejectLabel: "取消",
            accept: () => {goSignIn(myCode)},
            reject: () => {}
        });
    }

    const onSubmit: SubmitHandler<MyCode> = (data: MyCode) =>{
        confirmCheckIn(data)
    }


    return (
        
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 p-4">

                <h1>请输入你的<Chip label='入场码(?)' onClick={(e)=>{openHelper()}}/>，然后点击签到或者进行转让。</h1>

                <Controller 
                    name="myCode"
                    control={control}
                    rules={{
                        required: true, 
                        pattern:{
                            value: /^[A-z|0-9]{6,6}$/,
                            message: "你的入场码是一个6位的数字和字母的组合字符串, 例如 【TX887J】"
                        }
                        
                    }}
                    render={
                        ({ field , fieldState}) => (
                            <div className='grid grid-cols-1 gap-4'>
                                <div className="p-inputgroup">
                                    <span className="p-inputgroup-addon">
                                        <i className="pi pi-ticket"></i>
                                    </span>
                                   
                                    <InputText 
                                        required
                                        placeholder="你的入场码" 
                                        type="text"
                                        {...field}
                                        />
                                </div>
                            
                                {
                                    errors.myCode?.type === 'pattern' && 
                                    <Message severity="error" text={errors.myCode?.message} />
                                }

                                {
                                    errors.myCode?.type === 'required' && 
                                    <Message severity="error" text="请输入你的邀请码！" />
                                }
                                

                            </div>
                        )
                    } />

                
                <Button 
                    severity={isValid? 'success': 'warning'}
                    label="签到"
                    icon={isValid? 'pi pi-check':'pi pi-times'} 
                    iconPos="right"  
                    type="submit" />

                <ConfirmDialog />

            </div>
        </form>


    )
}

