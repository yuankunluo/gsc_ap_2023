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


    const { control, formState: { errors }, handleSubmit, reset } = useForm<UploadFormData>();



    const [password, setPassword] = useState('')
    const [fileText, setFileText] = useState('')
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
        

    const resetValue = () => {
        setError('')
        setPassword('')
        setFileText('')
        setCheckInData([])
        setPartCodeData([])
    }

    const uploadButtonDisable = () => {
        if (dataType == 'CheckIn'){
            return checkInData.length == 0
        } else {
            return partCodeData.length == 0
        }
    }


    const bottom = 
            <div className="grid grid-cols-1 gap-4">
                <Button severity="danger" disabled={ uploadButtonDisable() || password.length == 0} onClick={(e) => upload()}>Upload, Erase old data!!</Button>
                <Button severity="warning" onClick={(e) => reset()}>Reset</Button>
                <Button severity="info" onClick={(e) => {
                    reset();
                    router.back()
                    }}>Back</Button>
            </div>

    const onSubmit = (data: UploadFormData) => {
        console.log(data)
    }; 

    return (
        <Card title="Upload File" 
            subTitle="A CSV file containing: code, table_nr, optional: name, seat_nr"
            footer={bottom}
            >

            <Toast ref={toast} />

            <div id="upload_file_area">
                { isUploadPending?

                <ProgressSpinner /> :
                
                
                <form onSubmit={handleSubmit(onSubmit)} >
                    <div className="grid grid-cols-1 gap-6">
                        


                        <Controller name="password" 
                            control={control} 
                            rules={{ required: 'File is required.' }} 
                            render={({ field, fieldState }) => (
                                    <InputText type="passport"  id={field.name} {...field}/>
                                )} />

                        <Controller name="dataType" 
                            control={control} 
                            rules={{ required: 'File is required.' }} 
                            render={({ field, fieldState }) => (
                                <SelectButton id={field.name} {...field} options={['CheckIn' , 'PartyCode']} />
                                )} />


                        {/* <InputText 
                            aria-label="Choose File" 
                            accept="text/csv"
                            multiple={false}
                            id="upload_input" type="file" name="upload_file"
                            onChange={(e) => setFileText(e.target.value)}
                        /> */}

                        {/* <InputText aria-label="Password" id="password" type="password" name="password" placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        /> */}

                        <Button type="submit" label="Upload" severity="success"></Button>
                    </div>
                </form>
                            
                }
            </div>
                    
        </Card>  
    )
}