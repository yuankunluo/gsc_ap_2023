'use client'

import { InputText } from 'primereact/inputtext';
import { useRef, useState, useTransition } from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Chip } from 'primereact/chip';
import { ConfirmDialog } from 'primereact/confirmdialog'; // To use <ConfirmDialog> tag
import { confirmDialog } from 'primereact/confirmdialog'; 
import { Card } from 'primereact/card';
import { useForm, Controller , SubmitHandler} from 'react-hook-form';
import { Message } from 'primereact/message';
import { SwitchResponse, handleSwitch } from './actions';
import { Dialog } from 'primereact/dialog';
import { SwitchSuccessCard } from '../component/switchSuccessCard';
import ErrorCard from '../component/errorCard';
import { Toast } from 'primereact/toast';


interface SwitchCode {
    myCode: string
    hisCode: string 
}

export default function SwitchPage(){

    const {register, formState:{errors, isValid}, handleSubmit, control} = useForm<SwitchCode>()

    const [isPending, startTransition] = useTransition()
    const [switchReponse, setSwitchResponse] = useState<SwitchResponse>()

    const router = useRouter()
    const toast = useRef<Toast>(null);

    const comfirmSwitch = (data: SwitchCode) => {
        confirmDialog({
            message: `你自愿放弃你的坐席，并将此转让给对方。操作后，你将失去坐席，也不能再进行转让。已签到的入场码不能转让！`,
            header: '确认转让吗？',
            acceptLabel: "是的，我确定转让",
            rejectLabel: "取消",
            accept: () => {
                startTransition(()=>{

                    handleSwitch(data.myCode, data.hisCode)
                    .then(data=>{
                        setSwitchResponse(data)
                    }).catch(error=>{
                        console.error(error)
                        toast.current?.show({
                            severity:'error', 
                            summary: 'ERROR', 
                            detail:'发生未知错误', 
                            life: 3000})
                    })

                })
            },
            reject: () => {}
        });
    }


    const header = (
        <div className="grid grid-cols-1">
            <img className="h-30" alt="Card" src="/girl_ball.png" />
        </div>
    );


    
    const onSubmit: SubmitHandler<SwitchCode> = (data: SwitchCode)=>{
        comfirmSwitch(data)
    }

    return (
        <>
        <Toast ref={toast} />

        <div className="grid grid-cols-1 gap-4 p-4">

            <Card
            header={header}
            title="转让坐席给他人"
            subTitle="将爱传递给其他人！"
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid grid-cols-1 gap-4'>

                    <Controller 
                        name="myCode"
                        control={control}
                        rules={{
                            required: true, 
                            pattern:{
                                value: /^[A-z|0-9]{6,6}$/,
                                message: "入场码是一个6位的数字和字母的组合字符串, 例如 【TX887J】"
                            }
                            
                        }}
                        render={
                            ({ field , fieldState}) => (
                                <div className='grid grid-cols-1 gap-4'>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-heart"></i>
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
                                        <Message severity="error" text="请输入入场码！" />
                                    }
                                

                            </div>
                        )} />


                    <Controller 
                        name="hisCode"
                        control={control}
                        rules={{
                            required: true, 
                            pattern:{
                                value: /^[A-z|0-9]{6,6}$/,
                                message: "入场码是一个6位的数字和字母的组合字符串, 例如 【TX887J】"
                            }
                            
                        }}
                        render={
                            ({ field , fieldState}) => (
                                <div className='grid grid-cols-1 gap-4'>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-heart-fill"></i>
                                        </span>
                                    
                                        <InputText 
                                            required
                                            placeholder="他的入场码" 
                                            type="text"
                                            {...field}
                                            />
                                    </div>
                                
                                    {
                                        errors.hisCode?.type === 'pattern' && 
                                        <Message severity="error" text={errors.hisCode?.message} />
                                    }

                                    {
                                        errors.hisCode?.type === 'required' && 
                                        <Message severity="error" text="请输入入场码！" />
                                    }
                                

                            </div>
                        )} />

                        <div className='grid grid-cols-2 gap-4'>
                            <Button onClick={()=>router.back()}>返回</Button>
                            <Button
                                disabled={isPending}
                                severity={isValid? 'success': 'warning'}
                                icon="pi pi-check" 
                                iconPos='right'
                                label='转让'
                                type="submit"
                                >
                            </Button>
                        </div>
                        
                    </div>


                    
                </form>
                
                    
   
            </Card>

            <ConfirmDialog />

        </div>

        <Dialog header="转让成功" visible={switchReponse?.checkInData != undefined} style={{ width: '95vw' }} onHide={()=>{setSwitchResponse(undefined)}}>
            { switchReponse?.checkInData && <SwitchSuccessCard data={switchReponse?.checkInData} />}
        </Dialog>

        <Dialog header="转让失败" visible={switchReponse?.errorMessage != undefined } style={{ width: '95vw' }} onHide={() => {setSwitchResponse(undefined)}}>
            { switchReponse?.errorMessage && <ErrorCard errorName='转让错误' errorMessage={switchReponse?.errorMessage} showFooter={false}/> }
        </Dialog>
        </>
        
        
    )
}

