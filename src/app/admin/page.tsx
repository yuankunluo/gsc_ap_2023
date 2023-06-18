'use client'

import { useRef, useState, useTransition } from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { generateCheckInCode } from './actions';


export default function AdminPage(){

    const router = useRouter()
    const [activeIndex, setActiveIndex] = useState<number|number[]>()
    const [isGeneratingPending, startGeneratingTransition] = useTransition()

    const goToList = (segment: string)=>{
        router.push(`/admin/${segment}`)
    }

    const startGeneratingCheckInCode =() =>{
        startGeneratingTransition(()=>{
            generateCheckInCode().then((data)=>{

                if (data.errorMessage){
                    toast.current?.show({
                        severity:'error', 
                        summary: 'ERROR', 
                        detail:data.errorMessage, 
                        life: 3000})
                } else {
                    toast.current?.show({
                        severity:'success', 
                        summary: '成功', 
                        detail: `成功生成 ${data.count} 随机签到码`, 
                        life: 3000})
                }

                
            }).catch(error=>{
                toast.current?.show({
                    severity:'error', 
                    summary: 'ERROR', 
                    detail:'发生未知错误', 
                    life: 3000})
            })
        })
    }
    

    const toast = useRef<Toast>(null);

    return (
        <div className="w-full grid grid-cols-1 gap-4">
            <Toast ref={toast} />
            <Card
                title="签到管理"
                subTitle="这里是管理员区域，需要使用管理员密码"
                >
                <div className='grid gird-cols-1 gap-4'>
                    <Button severity='info' onClick={()=>goToList("check-in-code")} label='生成签到二维码' />
                    <Button disabled={isGeneratingPending} severity='info' onClick={()=>startGeneratingCheckInCode()} label='生成签到随机码' />
                    <Button severity='danger' onClick={()=>goToList("upload")} label='上传文件' />
                    <Button severity='success' onClick={()=>goToList("data-list")} label='查阅签到记录' />
                                    
                </div>
                
            </Card>
            
        </div>


    )
}