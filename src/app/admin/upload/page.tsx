'use client'

import { useRef, useState, useTransition } from "react"
import { CheckInData, PartyCodeData, UploadFileType, handleUploadCheckIn, handleUploadPartyCode } from "../handler";
import Papa from 'papaparse';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { useRouter } from "next/navigation";
import { Toast } from 'primereact/toast';
import { SelectButton } from 'primereact/selectbutton';
import { useForm , Controller} from "react-hook-form";


interface UploadFormData {
    password: string,
    dataType: UploadFileType,
    uploadFile: File
}


export default function Upload(){


    const { register, control, formState: { errors }, handleSubmit, reset } = useForm<UploadFormData>();



    const [password, setPassword] = useState('')
    const [checkInData, setCheckInData] = useState<CheckInData[]>([])
    const [partCodeData, setPartCodeData] = useState<PartyCodeData[]>([])
    const [dataType, setDataType] = useState<UploadFileType>("CheckIn")
    const [error, setError] = useState('')
    let [isUploadPending, startUploadTransition] = useTransition();
    const router = useRouter();

    const toast = useRef<Toast>(null);

    const upload = () => {
         
        startUploadTransition(() => {

                if (dataType == 'CheckIn'){
                    handleUploadCheckIn(checkInData, password);
                } else {
                    handleUploadPartyCode(partCodeData, password)
                }
                
                toast.current?.show({
                    severity:'success',
                    detail: 'Upload Successfully'
                })
                reset()
            }
        )
    }


    const parseCsv = (csv: string) => {

        if (dataType == 'PartyCode'){

            let {data, errors, meta} = Papa.parse<PartyCodeData>(csv, {
                header: true,
                skipEmptyLines: true,
                transformHeader: (value) => value.toLocaleLowerCase(),
                transform: (value) => value.toLocaleLowerCase()
            })

            console.log('parse PartyCode', data.length)

            console.debug(data, errors, meta)

            if (meta.fields && !meta.fields.includes('code')){
                setError("Filed missing")
            }

            // check duplication
            const codeList = data.map(d => d.code)
            const codeSet = new Set(codeList)
    
            if (codeList.length != codeSet.size){
                setError('Found duplicated code')
            }

            if (errors.length != 0){
                setError(`${JSON.stringify(errors)}`)
            }

            if (error){
                toast.current?.show(
                    {
                        severity:'error',
                        summary: 'Error',
                        detail: error
                    }
                )
                return;
            }
            setError('')
            setPartCodeData(data)
            
        } else {

            const {data, errors, meta} = Papa.parse<CheckInData>(csv, {
                header: true,
                skipEmptyLines: true,
                transformHeader: (value) => value.toLocaleLowerCase(),
                transform: (value) => value.toLocaleLowerCase()
            })

            console.log('parse CheckInData', data.length)
        
        
            const requiredFileds = ['code','table_nr']
    
            const founded = requiredFileds.map((f) => meta.fields?.includes(f)).reduce((a,b) => a && b, true)
    
            if (!founded){
                setError("required filed missing")
            }
    
            if (errors.length > 0){
                setError(`${JSON.stringify(errors)}`)
            } 
    
            // check duplication
            const codeList = data.map(d => d.code)
            const codeSet = new Set(codeList)
    
            if (codeList.length != codeSet.size){
                setError('Found duplicated code')
            }
    
            if (error){
                toast.current?.show(
                    {
                        severity:'error',
                        summary: 'Error',
                        detail: error
                    }
                )
                return;
            }
            setError('')
            setCheckInData(data);
        }
        
        

    }
        





    const onSubmit = (data: UploadFormData) => {
        console.log(dataType)
        console.log(data)
    }; 

    return (
        <Card title="Upload File" 
            subTitle="Upload a csv file will delete all old data!"
            // footer={bottom}
            >

            <Toast ref={toast} />

            <div id="upload_file_area">
                { isUploadPending?

                <ProgressSpinner /> :
                
                
                <form onSubmit={handleSubmit(onSubmit)} >
                    <div className="grid grid-cols-1 gap-6">
                        
                        <Controller name="dataType" 
                            control={control} 
                            render={({ field: { value, onChange, ...field } }) => (
                                <SelectButton 
                                    required
                                    {...field}
                                    // value={dataType}
                                    // onChange={(e) => {
                                    //     if (e.target.value == null){
                                    //         // setDataType(dataType)
                                    //     } else {
                                    //         setDataType(e.target.value)
                                    //     }
                                        
                                    // }}
                                id={field.name} options={['CheckIn' , 'PartyCode']} />
                                )} />

                        
                        <Controller name="password" 
                            control={control} 
                            render={({ field, fieldState }) => (
                                    <div className="p-inputgroup">
                                    <span className="p-inputgroup-addon">
                                        <i className="pi pi-user"></i>
                                    </span>
                                    <InputText 
                                        required
                                        placeholder="Password" type="passport"  id={field.name} {...field}/>
                                    </div>
                        )} />

                
                        <Controller
                            control={control}
                            name="uploadFile"
                            rules={{ required: "Recipe picture is required" }}
                            render={({ field: { value, onChange, ...field } }) => {
                            return (
                                <InputText
                                required
                                aria-label="Choose File" 
                                accept="text/csv"
                                multiple={false}
                                {...field}
                                onChange={(event) => {
                                    onChange(event.target.files? event.target.files[0] : null);
                                }}
                                type="file"
                                id="picture"
                                />
                            );
                            }}
                        />
                    
                        <Button type="submit" label="Upload" severity="success"></Button>
                        <Button onClick={()=>router.back()} label="Cancel" severity="info"></Button>
                    </div>
                </form>
                            
                }
            </div>
                    
        </Card>  
    )
}