'use client'

import { useState } from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';


export default function AdminPage(){

    const router = useRouter()
    const [activeIndex, setActiveIndex] = useState<number|number[]>()

    const goToList = (segment: string)=>{
        router.push(`/admin/${segment}`)
    }
   

    return (
        <div className="w-full grid grid-cols-1 gap-4">

            <Card
                title="签到管理"
                subTitle="这里是管理员区域，需要使用管理员密码"
                >
                <div className='grid gird-cols-1 gap-4'>
                    <Button security='info' onClick={()=>goToList("upload")} label='上传文件' />
                    <Button security='info' onClick={()=>goToList("data-list")} label='查阅签到记录' />
                </div>
                
            </Card>
            
        </div>


    )
}