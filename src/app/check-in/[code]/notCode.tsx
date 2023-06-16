'use client'

import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

export default function NoCode(){

    const router = useRouter()

    const footer = <div>
        <Button onClick={() => {router.back()}} >返回</Button>
    </div>

    return (
        <div className='grid grid-cols-1 p-5'>
            <Card
                footer={footer}
                title="错误" 
                subTitle="找不到座位记录"
            >
                抱歉！我们没有你的坐席记录。请联系组委会工作人员核实。
            </Card>
        </div>
    ) 
}