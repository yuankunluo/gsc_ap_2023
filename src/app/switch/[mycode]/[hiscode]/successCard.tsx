'use client'

import { Card } from 'primereact/card';
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { CheckInData } from '@/app/admin/handler';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';


export function SuccessCard(props: {
    data: CheckInData
}) {

    const router = useRouter();

     const header = (
        <div className="grid grid-cols-1">
            <img className="h-24" alt="Card" src="/banner.png" />
        </div>
    );

    const footer = <div>
        <Button onClick={()=>router.back()}>返回</Button>
    </div>

    return (
        <div className="grid grid-cols-1 p-4">
        <Card
            header={header}
            title="年会坐席转让卡"
            subTitle="感谢你转让你的坐席给其他人，让我们将爱传递！"
            footer={footer}
            >
            <Message severity="success" text="已经确认以下的坐席！" />

            <Divider />
            <ul>
                <li><span>入场码：</span>{props.data.code}</li>
                <li><span>昵称：</span>{props.data.name}</li>
                <li><span>桌号：</span>{props.data.table_nr}</li>
                <li><span>座位号：</span>{props.data.seat_nr}</li>
                <li><span>转让记录：</span>{props.data.history}</li>
            </ul>

            <h3>请截图保存以作备份!</h3>
        </Card>
    </div>
    )
}