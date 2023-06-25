'use client'

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";
import { InputTextarea } from 'primereact/inputtextarea';
import { HandleSubmitResponse, PrizeListResponse, getPrizeList, handleUploadAddress } from "./actions";
import { useEffect, useRef, useState, useTransition } from "react";
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Chip } from "primereact/chip";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { WinnerListData } from "../admin/actions";


export interface WinnerAddressData {
    name: string 
    address: string 
    phone: number
    code: string 
    prize: string 
    staff_id: string 
    hash_code?: string 
}

type FormControlName = 'name'| 'phone' | 'address' | 'code' | 'staff_id'
type FormControlType = 'InputText' | 'InputTextarea'

interface FormConfig {
    controlName: FormControlName
    type: FormControlType
    icon: string
    title: string
}


const defaultFormConfigs:FormConfig[] = [
    {
        controlName: 'code',
        type: 'InputText',
        icon: 'pi-ticket',
        title: '专属入场码'
    },
    {
        controlName: 'name',
        type: 'InputText',
        icon: 'pi-user',
        title: '收货人姓名'
    },
    {
        controlName: 'phone',
        type: 'InputText',
        icon: 'pi-phone',
        title: '收货人手机号码'
    },
    {
        controlName: 'address',
        type: 'InputTextarea',
        icon: 'pi-truck',
        title: '详细收货地址'
    },
]


export default function WinnerListPage(){


    const {register, formState:{errors, isValid}, handleSubmit, control, getValues} = useForm<WinnerAddressData>()

    const [prizeListData, setPrizeListData] = useState<string[]>()
    const [isFetchPrizeList, startFetchingPrizeListTransaction] = useTransition()
    const toast = useRef<Toast>(null)
    const [formConfig, setFormConfig] = useState<FormConfig[]>(defaultFormConfigs)
    const [visibleSubmit, setVisibleSubmit] = useState(false)
    const [isSubmitting, startSubmitTransaction] = useTransition()
    const [response, setResponse] = useState<HandleSubmitResponse>()

    useEffect(()=>{
        startFetchingPrizeListTransaction(()=>{
            getPrizeList().then(data => {
                if (data.prizeList){
                    setPrizeListData(data.prizeList.sort())
                }
                if (data.error){
                    toast.current?.show({
                        severity:'error', 
                        summary: 'ERROR', 
                        detail: data.error, 
                        life: 3000})
                }
            }).catch(error => {
                console.error(error)
            })
        })
    }, [])

    
    const onSubmit = (data: WinnerAddressData) => {
        setVisibleSubmit(true)
    }

    const goSubmit = ()=>{
        setVisibleSubmit(false)
        console.log(getValues())
        startSubmitTransaction(()=>{
            handleUploadAddress(getValues()).then(response => {
                
                setResponse(response)
                
                if (response.error){
                    toast.current?.show({
                        severity:'error', 
                        summary: 'ERROR', 
                        detail: response.error, 
                        life: 3000})
                }

            }).catch(error => {
                console.error(error)
            })
        })
    }

    return <div className="p-4">
        <Toast ref={toast} />


        <Dialog header="结果" visible={response != null} style={{ width: '95vw' }} 
            onHide={() => {setResponse(undefined)}}>
            {response?.data && <div className="grid grid-cols gap-2">
                <h1>感谢你提交数据，我们已经收到！请耐心等待发货</h1>

                <Divider />
                <p><Chip label="奖项:" />{getValues()['prize']}</p>
                <p><Chip label="工号后四位:" />{getValues()['staff_id']}</p>
                <p><Chip label="入场码:" />{getValues()['code']}</p>
                <p><Chip label="姓名:" />{getValues()['name']}</p>
                <p><Chip label="手机:" />{getValues()['phone']}</p>
                <p><Chip label="地址:" />{getValues()['address']}</p>
                <Message severity="success" text="已经确认，请截图保存" />
                <Divider />


                <Button label="返回" onClick={()=>{setResponse(undefined)}} severity="danger"/>
            </div>
            }
        
            {response?.error && <div className="grid grid-cols gap-2">
                <h1>遇到错误</h1>

                <Divider />
                <Message severity="error" text={response.error} />

                如果你有疑问，请使用内部邮箱联系 Dora L H LONG， Doug Y K LUO, Eric E L CHEN, Cidy Qian Yi GUO.

                <Divider />

                <Button label="返回" onClick={()=>{setResponse(undefined)}} severity="danger"/>
            </div>
            }


        </Dialog>

        <Dialog header="确定提交？" visible={visibleSubmit} style={{ width: '95vw' }} onHide={() => {setVisibleSubmit(false)}}>
            <div className="grid grid-cols gap-2">
            <h1>请再仔细核对一遍你的收货信息，提交之后不能再就行修改。请你认真操作！</h1>
            <p>请放心，我们会严格保留你的个人信息，年会结束后销毁。你的员工号后四位只为用来计算HASH， 不会被保存！</p>

            <Divider />
            <p><Chip label="奖项:" />{getValues()['prize']}</p>
            <p><Chip label="工号后四位:" />{getValues()['staff_id']}</p>
            <p><Chip label="入场码:" />{getValues()['code']}</p>
            <p><Chip label="姓名:" />{getValues()['name']}</p>
            <p><Chip label="手机:" />{getValues()['phone']}</p>
            <p><Chip label="地址:" />{getValues()['address']}</p>
            
            <Divider />

            <Button label="提交" onClick={()=>goSubmit()} severity="success"/>
            <Button label="取消" onClick={()=>{setVisibleSubmit(false)}} severity="danger"/>
            </div>

        </Dialog>

        {
            prizeListData &&
            <Card
            // header={header}
            title="恭喜你获奖！"
            subTitle="请在一下表格中填入你的收货信息，注意，你只能填写一次！请谨慎操作。"
        >
            <div className="grid grid-cols-1 gap-4">
                <form onSubmit={handleSubmit(onSubmit)}>

                <div className="grid grid-cols-1 gap-4">


                        <Controller
                            name = 'prize'
                            control={control}
                            rules={{required:true}}
                            render={({field}) => (
                                <div className="p-inputgroup">
                                    <span className="p-inputgroup-addon">
                                        <i className={`pi pi-gift`}></i>
                                    </span>
                                            
                                    <Dropdown
                                        disabled={isSubmitting}
                                        options={prizeListData}
                                        {...field}
                                        placeholder="请选择你获得的奖项"
                                        className="w-full md:w-14rem" />
                                </div>
                                
                            )}
                        />

                        <Controller 
                                name='staff_id'
                                control={control}
                                rules={{
                                    required: true, 
                                    pattern:{
                                        value: /^[0-9]{4,4}$/,
                                        message: "请输入你的员工号后4位，例如 【2023】"
                                    }
                                }}
                                render={
                                    ({ field }) => (
                                        <div className='grid grid-cols-1 gap-4'>
                                            <div className="p-inputgroup">
                                                <span className="p-inputgroup-addon">
                                                    <i className="pi pi-id-card"></i>
                                                </span>
                                                
                                                <InputText 
                                                    disabled={isSubmitting}
                                                    required
                                                    placeholder="工号后四位"
                                                    {...field}
                                                    />
                                            </div>
                                        
                                        </div>
                                    )
                                } />
                        
                        {
                            errors.staff_id?.type === 'pattern' && 
                            <Message severity="error" text="请输入你的员工号后4位，例如 【2023】" />
                        }

                        {
                            formConfig.filter(f => f.type =='InputText').map(config => 
                                <Controller
                                key={config.controlName} 
                                name={config.controlName}
                                control={control}
                                rules={{
                                    required: true, 
                                }}
                                render={
                                    ({ field:{onChange} }) => (
                                        <div className='grid grid-cols-1 gap-4'>
                                            <div className="p-inputgroup">
                                                <span className="p-inputgroup-addon">
                                                    <i className={`pi ${config.icon}`}></i>
                                                </span>
                                                
                                                <InputText
                                                    disabled={isSubmitting}
                                                    required
                                                    placeholder={config.title}
                                                    />
                                            </div>
                                        
                                        </div>
                                    )
                                } />)
                        }


                        <Controller 
                                name='address'
                                control={control}
                                rules={{
                                    required: true, 
                                }}
                                render={
                                    ({ field }) => (
                                        <div className='grid grid-cols-1 gap-4'>
                                            <div className="p-inputgroup">
                                                <span className="p-inputgroup-addon">
                                                    <i className='pi pi-home'></i>
                                                </span>
                                                
                                                <InputTextarea
                                                    disabled={isSubmitting}
                                                    required
                                                    placeholder='你的详细收货地址， 例如 广东省广州市天河区天河路338号太古汇27-888'
                                                    {...field}
                                                    />
                                            </div>
                                        
                                        </div>
                                    )
                                } />
                        
                        <Button disabled={isSubmitting} type="submit" label={isSubmitting? "提交中..." : "提交"} />
                    </div>
                </form>
                
                <Button severity="danger"  label="返回" />
            </div>

        
            
        </Card>
        } 
    </div>
}