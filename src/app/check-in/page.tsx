'use client'

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Chip } from 'primereact/chip';
import { ConfirmDialog } from 'primereact/confirmdialog'; // To use <ConfirmDialog> tag
import { confirmDialog } from 'primereact/confirmdialog'; 
import { useForm, Controller , SubmitHandler} from 'react-hook-form';
import { Message } from 'primereact/message';

interface MyCode {
    myCode: string,
    checkInCode: string
}

export default function CheckInPage(){

    const {register, formState:{errors, isValid}, handleSubmit, control} = useForm<MyCode>()
    const router = useRouter()

    const goSignIn = (myCode: MyCode) => {
        // router.push(`/check-in/${myCode.myCode}`)
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
            message: `【签到码】是年会现场入口公布的一组四位数字的密码，确保只有到场的人能签到。`,
            header: '签到码',
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
                            value: /^[0-9]{4,4}$/,
                            message: "你的【签到码】是一个4位的数字, 请询问工作人员获取。 例如 【8081】"
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
                                        type="number"
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

