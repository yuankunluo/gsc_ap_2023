'use client'

import { useRouter } from "next/navigation"
import { Chip } from "primereact/chip"
import { useForm , SubmitHandler, Controller} from "react-hook-form"
import { ConfirmDialog } from 'primereact/confirmdialog'; // To use <ConfirmDialog> tag
import { confirmDialog } from 'primereact/confirmdialog'; 
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
import { useRef, useState, useTransition } from "react";
import { CheckSeatResponse, hancleCheckSeat } from "./actions";
import { Dialog } from "primereact/dialog";
import { CheckInCard } from "../component/checkInCard";
import ErrorCard from "../component/errorCard";
import { Toast } from "primereact/toast";

interface SeatRequestData {
    myCode: string
}

export default function SeatPage(){

    const openHelper = () => {
        confirmDialog({
            message: `【入场码】是工会或者委员会通过内部邮件发送给你的一个与您的STAFF ID绑定的一串字符。`,
            header: '入场码',
            acceptLabel: "我了解了",
            rejectLabel: "我拒绝",
            rejectClassName: "no-show",
            accept: () => {},
            reject: () => {}
        });
    }

    const {register, formState:{errors, isValid}, handleSubmit, control} = useForm<SeatRequestData>()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [checkInResponse, setCheckInResponse] = useState<CheckSeatResponse>()
    const toast = useRef<Toast>(null);

    const onSubmit: SubmitHandler<SeatRequestData> = (data: SeatRequestData) =>{
        checkSeat(data)
    }


    const checkSeat = (data: SeatRequestData) => {
        startTransition(()=>{

            hancleCheckSeat(data.myCode)
            .then(data => {
                setCheckInResponse(data)
            })
            .catch(error => {
                toast.current?.show({
                    severity:'error', 
                    summary: 'ERROR', 
                    detail:'发生未知错误', 
                    life: 3000})
            })
            
        })
    }

    return (
        <>
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className="grid grid-cols-1 gap-4 p-4">
            

            <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 gap-4 p-4'>
                <h1>请输入你的<Chip label='入场码(?)' onClick={(e)=>{openHelper()}}/>然后点击查询查看坐席。</h1>

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
                                        <Message severity="error" text="请输入你的入场码！" />
                                    }
                                    

                                </div>
                            )
                        } />


                    <Button 
                        disabled={isPending}
                        severity={isValid? 'success': 'warning'}
                        label={isPending ? '查询中...' : '立即查询' }
                        icon={isValid? 'pi pi-check':'pi pi-times'} 
                        iconPos="right"  
                        type="submit" />

            </form>

            <div className='grid grid-cols-1 gap-4 px-4'>    
                <Button severity='info' onClick={()=>{router.back()}} label="返回" />
            </div>

        </div>


        <Dialog header="查询成功" visible={checkInResponse?.checkInData != undefined} style={{ width: '95vw' }} onHide={()=>{setCheckInResponse(undefined)}}>
            { checkInResponse?.checkInData && <CheckInCard title="坐席卡" data={checkInResponse?.checkInData} />}
        </Dialog>

        <Dialog header="查询失败" visible={checkInResponse?.errorMessage != undefined } style={{ width: '95vw' }} onHide={() => {setCheckInResponse(undefined)}}>
            { checkInResponse?.errorMessage && <ErrorCard errorName='坐席错误' errorMessage={checkInResponse?.errorMessage} showFooter={false}/> }
        </Dialog>
        </>
    )
}