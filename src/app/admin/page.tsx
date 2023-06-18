'use client'

import { useRef} from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';


export default function AdminPage(){

    const router = useRouter()

    const goToList = (segment: string)=>{
        router.push(`/admin/${segment}`)
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
                    <Button severity='danger' onClick={()=>goToList("upload")} label='上传文件' />
                    <Button severity='success' onClick={()=>goToList("data-list")} label='查阅签到记录' />
                                    
                </div>
                
            </Card>
            
        </div>


    )
}