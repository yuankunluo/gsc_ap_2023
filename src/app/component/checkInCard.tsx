'use client'

import { convertToDateString } from "@/utils";
import { CheckInData } from "../admin/actions";
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Chip } from 'primereact/chip';

export function CheckInCard(props: {
    data: CheckInData
    title?: string
    subTitle?: string
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
        title={ props.title? props.title : `GSC CHINA 2023 年会`}
        subTitle={props.subTitle? props.subTitle:  "欢迎您出席！请出示此卡给工作人员"}
        >
            <div>
                <ul>
                    <li><span className="w-3/12	">入场码：</span><Chip label={props.data.code.toUpperCase()}/></li>
                    <li><span className="w-3/12	">昵称：</span>{props.data.name?.toLocaleUpperCase()}</li>
                    <li><span className="w-3/12	">桌号：</span><Chip label={props.data.table_nr.toLocaleUpperCase()} /></li>
                    <li><span>座位号：</span>{props.data.seat_nr?.toLocaleUpperCase()}</li>
                    <li><span>签到时间:</span>{convertToDateString(props.data.check_in)}</li>
                    <li><span>签到码:</span>{props.data.check_in_code?.toUpperCase()}</li>
                    <li><span>转让记录:</span>{props.data.history?.toLocaleUpperCase()}</li>
                    <li><span>录入时间::</span>{convertToDateString(props.data.inserted_at)}</li>
                </ul>
            </div>
       

    </Card>
</div>
}