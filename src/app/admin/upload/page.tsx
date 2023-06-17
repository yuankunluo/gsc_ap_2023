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
import { Message } from 'primereact/message';


interface UploadFormData {
    password: string,
    dataType: UploadFileType,
    uploadFile: File
}


export default function Upload(){

    const [dataErrors, setDataErrors] = useState<string[]>([])
    const { register, control, formState: { errors, isValid }, handleSubmit, reset } = useForm<UploadFormData>();


    let [isUploadPending, startUploadTransition] = useTransition();
    const router = useRouter();

    const toast = useRef<Toast>(null);


   const uploadPartyCodeData = (csv: string, password: string) => {

        const parseErrors : string[] = []

        let {data, errors, meta} = Papa.parse<PartyCodeData>(csv, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (value) => value.toLocaleLowerCase(),
            transform: (value) => value.toLocaleLowerCase(),
            delimitersToGuess: [',','\t','\n']
        })

        console.log('parse PartyCode', data.length)

        console.debug(data, errors, meta)

        if (meta.fields && !meta.fields.includes('code')){
            parseErrors.push("Filed missing: code")
        }

        if (errors.length != 0){
            errors.forEach(e => parseErrors.push(e.message))
        }

        const codeList = data.map(d => d.code)
        const codeSet = new Set(codeList)

        if (codeList.length != codeSet.size){
            parseErrors.push('Found duplicated code')
        }

        if (parseErrors.length != 0){
            setDataErrors(parseErrors)
            return
        }

        startUploadTransition(() => {
            handleUploadPartyCode(data, password);
            
            toast.current?.show({
                severity:'success',
                detail: 'Upload Successfully'
            })
            setDataErrors([])
        })
    }

   const uploadChekInData = (csv: string, password: string) => {

        const parseErrors : string[] = []
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
            parseErrors.push("required filed missing: code, table_nr")
        }

        if (errors.length > 0){
            errors.forEach(e => parseErrors.push(e.message))
        } 

        // check duplication
        const codeList = data.map(d => d.code)
        const codeSet = new Set(codeList)

        if (codeList.length != codeSet.size){
            parseErrors.push('Found duplicated code')
        }

        if (parseErrors.length != 0){
            setDataErrors(parseErrors)
            return
        }
        
        startUploadTransition(() => {
            
            handleUploadCheckIn(data, password);
            
            toast.current?.show({
                severity:'success',
                detail: 'Upload Successfully'
            })
            setDataErrors([])
        })
    
   }
        
        







    const onSubmit = (data: UploadFormData) => {
        console.log(data)

        data.uploadFile.text().then(
            text => {
                if (data.dataType == 'CheckIn'){
                    uploadChekInData(text, data.password)
                } else {
                    uploadPartyCodeData(text, data.password)
                }
            }
        ).catch((errror) => {
            console.error(errror)
        })
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
                            rules={
                                {
                                    required: "please choose a datatype"
                                }
                            }
                            render={({ field}) => (
                                <SelectButton 
                                    required
                                    {...field}
                                    id={field.name} 
                                    options={['CheckIn' , 'PartyCode']} />
                                )} />

                        
                        <Controller name="password" 
                            control={control}
                            rules={
                                {
                                    required: "password is required"
                                }
                            }
                            render={({ field, fieldState }) => (
                                    <div className="p-inputgroup">
                                    <span className="p-inputgroup-addon">
                                        <i className="pi pi-user"></i>
                                    </span>
                                    <InputText 
                                        placeholder="Password" type="passport"  id={field.name} {...field}/>
                                    </div>
                        )} />

                
                        <Controller
                            control={control}
                            name="uploadFile"
                            rules={{ required: "csv data is required" }}
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

                        { dataErrors.length != 0 && <Message severity="error" text={JSON.stringify(dataErrors)}/> }
                    
                        <Button disabled={!isValid} type="submit" label="Upload" severity="success"></Button>
                        <Button onClick={()=>router.back()} label="Cancel" severity="info"></Button>
                    </div>
                </form>
                            
                }
            </div>
                    
        </Card>  
    )
}