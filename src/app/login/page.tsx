'use client'

import { Toast } from "primereact/toast";
import { useRef, useState, useTransition } from "react";
import { useForm , SubmitHandler, Controller} from "react-hook-form";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useRouter } from "next/navigation";
import { login } from "./actions";


interface LogInData {
    password: string
}

export default function LogInPage(){

    const toast = useRef<Toast>(null);
    const {register, formState:{errors, isValid}, handleSubmit, control} = useForm<LogInData>()
    const [isLogingPending, startLogingTransition]  = useTransition()
    const [isLogin, setIsLogin] = useState(false)

    const onSubmit: SubmitHandler<LogInData> = (data: LogInData) =>{
        console.log(data)

        startLogingTransition(()=>{
            login(data.password).then((response)=>{
                console.log('response', response)

                if (response.errorMessage){
                    toast.current?.show({
                        severity:'error', 
                        summary: 'ERROR', 
                        detail: response.errorMessage, 
                        life: 3000})
                } else {
                    toast.current?.show({
                        severity:'success', 
                        summary: '登录成', 
                        detail: '请点击按钮进去管理页面', 
                        life: 3000})
                    setIsLogin(true)
                }   

            }).catch((error)=>{
                console.error(error)
            })

        })
    }

    const router = useRouter()


    return <>
        <Toast ref={toast} />
        <div className="grid grid-cols-1 gap-4 p-4">

            <h1>管理员登录</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 gap-4'>
                <Controller 
                        name="password"
                        control={control}
                        rules={{
                            required: true, 
                        }}
                        render={
                            ({ field , fieldState}) => (
                                <div className='grid grid-cols-1 gap-4'>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-user"></i>
                                        </span>
                                    
                                        <InputText 
                                            required
                                            placeholder="你的管理员密码" 
                                            type="password"
                                            {...field}
                                            />
                                    </div>

                                    {
                                        errors.password?.type === 'required' && 
                                        <Message severity="error" text="请输入你的管理员密码！" />
                                    }
                                    

                                </div>
                            )
                        } />


                {!isLogin && <Button
                        severity='success'
                        label='登录' 
                        icon='pi pi-check'
                        iconPos="right"  
                        type="submit" /> }
            </form>

            {isLogin && <Button onClick={()=>{
                
                console.log("go to admin")
                window.location.replace('/admin');

            }} label="进入管理员界面" severity="warning" />}

            <Button onClick={()=>{router.push("/")}} label="返回" />
        </div>
    </>
}