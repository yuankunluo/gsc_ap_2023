'use client'

import { CheckInData } from "@/app/admin/handler";
import { Card } from 'primereact/card';
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { convertToDateString } from "@/utils";

export default function TableCard(props: {data: CheckInData}) {

    
    const router = useRouter();
    const header = (
        <div className="grid grid-cols-1">
            <img className="h-24" alt="Card" src="/banner.png" />
        </div>
    );

    const footer = <div>
        <Button onClick={()=>router.back()}>返回</Button>
    </div>

    

    return <div className="grid grid-cols-1 p-4">
        <Card
            header={header}
            title="GSC CHINA 2023 年会签到卡"
            subTitle="欢迎您出席！请出示此卡给工作人员"
            footer={footer}
            >
            <ul>
                <li><span>邀请码：</span>{props.data.code}</li>
                <li><span>昵称：</span>{props.data.name}</li>
                <li><span>桌号：</span>{props.data.table_nr}</li>
                <li><span>座位号：</span>{props.data.seat_nr}</li>
                <li><span>签到时间:</span>{convertToDateString(props.data.check_in)}</li>
                <li><span>录入时间:</span>{convertToDateString(props.data.inserted_at)}</li>
                
            </ul>
        </Card>
    </div>
}