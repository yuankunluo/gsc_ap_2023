'use client'

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { ConfirmDialog } from 'primereact/confirmdialog'; // To use <ConfirmDialog> tag
import { confirmDialog } from 'primereact/confirmdialog'; 
import { useForm, Controller , SubmitHandler} from 'react-hook-form';
import { Message } from 'primereact/message';
import { useRef, useState, useTransition } from 'react'
import { CheckInResponse, handleCheckIn } from './actions';
import { Dialog } from 'primereact/dialog';
import { CheckInCard } from '../component/checkInCard';
import ErrorCard from '../component/errorCard';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'


interface MyCheckInData {
    myCode: string,
    checkInCode: string
}

export default function CheckInPage(){

    const [isPending, startTransition] = useTransition()
    const [checkInResponse, setCheckInResponse] = useState<CheckInResponse>()

    const toast = useRef<Toast>(null);
    const router = useRouter()
    const searchParams = useSearchParams()
    const checkInCode = searchParams.get('check_code')

    const defaultValue: MyCheckInData = {
        myCode: '',
        checkInCode: ''
    }

    if (checkInCode){
        defaultValue.checkInCode = checkInCode
        
    }


    const {register, formState:{errors, isValid}, handleSubmit, control} = useForm<MyCheckInData>({
        defaultValues: defaultValue
    })


    const goCheckIn = (data: MyCheckInData) => {
        // router.push(`/check-in/${myCode.myCode}`)
        try{
            startTransition(()=>{
                handleCheckIn(data.myCode, data.checkInCode).then(
                    (data) => {
                        setCheckInResponse(data)
                    }
                ).catch((error) => {
                    toast.current?.show({
                        severity:'error', 
                        summary: 'ERROR', 
                        detail:'发生未知错误', 
                        life: 3000})
                })
            })
        } catch(error){
            console.error(error)
        }
        
    }

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

    const openHelperCheckInCode = () => {
        confirmDialog({
            message: `【签到码】是年会现场入口公布的一组四位数字和字母组合的随机，只有到场的人能签到。`,
            header: '签到码',
            acceptLabel: "我了解了",
            rejectLabel: "我拒绝",
            rejectClassName: "no-show",
            accept: () => {},
            reject: () => {}
        });
    }


    const confirmCheckIn = (myCode: MyCheckInData) => {
        confirmDialog({
            message: '签到之后，你的坐席将被锁定，而且你也不能再进行转让。请您确认你会到场，并点击确定。如果你还不确定能出席，请点击取消',
            header: '你确定签到？',
            acceptLabel: "确定",
            rejectLabel: "取消",
            accept: () => {goCheckIn(myCode)},
            reject: () => {}
        });
    }

    const onSubmit: SubmitHandler<MyCheckInData> = (data: MyCheckInData) =>{
        confirmCheckIn(data)
    }


    return (
        <>
        <Toast ref={toast} />
        <div className="grid grid-cols-1 gap-4 p-4">
           

            <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 gap-4 p-4'>
            
                <h1>请输入你的
                        <Chip label='入场码(?)' onClick={(e)=>{openHelper()}}/>
                        和
                        <Chip label='签到码(?)' onClick={(e)=>{openHelperCheckInCode()}}/>
                        然后点击签。</h1>

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

                <Controller 
                    name="checkInCode"
                    control={control}
                    rules={{
                        required: true, 
                        pattern:{
                            value: /^[A-z|0-9]{4,4}$/,
                            message: "你的【签到码】是一个4位的数字和字母的组合, 请询问工作人员获取。 例如 【8LTF】"
                        }
                        
                    }}
                    render={
                        ({ field , fieldState}) => (
                            <div className='grid grid-cols-1 gap-4'>
                                <div className="p-inputgroup">
                                    <span className="p-inputgroup-addon">
                                        <i className="pi pi-check-circle"></i>
                                    </span>
                                   
                                    <InputText 
                                        type="text"
                                        required
                                        placeholder="签到码" 
                                        {...field}
                                        />
                                </div>
                            
                                {
                                    errors.checkInCode?.type === 'pattern' && 
                                    <Message severity="error" text={errors.checkInCode?.message} />
                                }

                                {
                                    errors.checkInCode?.type === 'required' && 
                                    <Message severity="error" text="请输签到码！" />
                                }
                                

                            </div>
                        )
                    } />

                <Button 
                        disabled={isPending}
                        severity={isValid? 'success': 'warning'}
                        label={isPending ? '签到中...' : '立即签到' }
                        icon={isValid? 'pi pi-check':'pi pi-times'} 
                        iconPos="right"  
                        type="submit" />
            </form>

            <div className='grid grid-cols-1 gap-4 px-4'>
                
                    <Button severity='info' onClick={()=>{router.back()}} label="返回" />
            </div>
        </div>



        <ConfirmDialog />

       <Dialog header="签到成功" visible={checkInResponse?.checkInData != undefined} style={{ width: '95vw' }} onHide={()=>{setCheckInResponse(undefined)}}>
            { checkInResponse?.checkInData && <CheckInCard title='签到卡' data={checkInResponse?.checkInData} />}
        </Dialog>

        <Dialog header="签到失败" visible={checkInResponse?.errorMessage != undefined } style={{ width: '95vw' }} onHide={() => {setCheckInResponse(undefined)}}>
            { checkInResponse?.errorMessage && <ErrorCard errorName='签到错误' errorMessage={checkInResponse?.errorMessage} showFooter={false}/> }
        </Dialog>

        </>
    )
}

