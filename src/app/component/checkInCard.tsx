'use client'

import { convertToDateString } from "@/utils";
import { CheckInData } from "../admin/actions";
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';

export function CheckInCard(props: {
    data: CheckInData
}){


    const header = (
        <div className="grid grid-cols-1">
            <img className="h-24" alt="Card" src="/banner.png" />
            <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>

        </div>
    );

    return <div className="grid grid-cols-1">
    <Card
        header={header}
        title="GSC CHINA 2023 年会签到卡"
        subTitle="欢迎您出席！请出示此卡给工作人员"
        >
            <div>
                <ul>
                    <li><span>邀请码：</span>{props.data.code}</li>
                    <li><span>昵称：</span>{props.data.name}</li>
                    <li><span>桌号：</span>{props.data.table_nr}</li>
                    <li><span>座位号：</span>{props.data.seat_nr}</li>
                    <li><span>签到时间:</span>{convertToDateString(props.data.check_in)}</li>
                    <li><span>录入时间:</span>{convertToDateString(props.data.inserted_at)}</li>
                </ul>
            </div>
       

    </Card>
</div>
}