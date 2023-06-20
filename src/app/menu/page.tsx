'use client'

import { Card } from 'primereact/card'
import MenuMdx from './menu.mdx'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'

export default function ManuPage(){

    const router = useRouter()

    const footer = <div>
        <Button severity='info' label="返回" onClick={()=>{router.back()}} />
    </div>

    return <div className="grid grid-cols-1 gap-4">
        
        <Card
            title="节目单"
            subTitle="*可能因为时间等关系就行调整"
            footer={footer}
        >
            <MenuMdx />
        </Card>

    </div>
}