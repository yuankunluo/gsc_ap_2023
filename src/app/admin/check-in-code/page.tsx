'use client'

import { useEffect, useRef, useState, useTransition } from "react"
import { CheckInCodeData, getCheckInCode } from "../actions"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { useRouter } from "next/navigation"
import { Card } from "primereact/card"
import QRCode from "react-qr-code"
import { getRandom } from "@/utils"
import { ProgressBar } from 'primereact/progressbar';


export default function CheckInCodePage(){

    const [checkInCodeData, setCheckInCodeData] = useState<CheckInCodeData[]>()
    const [progressBarValue, setProgressBarValue] = useState<number>(0)
    const [randomIndex, setRandomIndex] = useState<string>()
    const [isPending, startTransition] = useTransition()
    const toast = useRef<Toast>(null);
    const router = useRouter()


    const refresh = ()=>{
        startTransition(()=>{

            getCheckInCode().then((data)=>{

                if (data.errorMessage){
                    toast.current?.show({
                        severity:'error', 
                        summary: data.errorMessage, 
                        detail:'发生未知错误', 
                        life: 3000})
                } 

                if (data.codes){
                    toast.current?.show({
                        severity:'success', 
                        summary: `获得 ${data.codes.length} 条签到码`, 
                        life: 3000})
                    
                    setCheckInCodeData(data.codes)
                    setRandomIndex(data.codes[0].code)
                } 

            }).catch((error)=>{
                console.error(error)
            })

        })
    }


    useEffect(() => {

        const intervalMS = 1000*15
        
        const interval = setInterval(() => {
            if (checkInCodeData?.length && checkInCodeData.length>0){
                const random = getRandom(1, checkInCodeData.length-1)
                setRandomIndex(checkInCodeData[random].code)
            }
        }, intervalMS);
    
        return () => clearInterval(interval);
      }, [checkInCodeData]);


    const header = <>
        <ProgressBar value={progressBarValue}></ProgressBar>
    </>

    return <>
        <Toast ref={toast} />

        <div className="w-full">
            <Card 
                // header={header}
                subTitle="请使用以上的【签到码】进行签到"
                title={randomIndex? randomIndex?.toLocaleUpperCase() : '请刷新'}>
                <div className="grid grid-cols-1 p-4 gap-4">
                    <QRCode value={`${window.location.origin}/check-in`} />
                    
                    <Button disabled={isPending} label="刷新" onClick={()=>{refresh()}} severity="success"/>
                    <Button disabled={isPending} label="返回" onClick={()=>{router.back()}} severity="info"/>
                </div>
            </Card>
        </div>
        
       
    </>

}