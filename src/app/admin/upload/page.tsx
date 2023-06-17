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


    const { register, control, formState: { errors, isValid }, handleSubmit, reset } = useForm<UploadFormData>();


    const [checkInData, setCheckInData] = useState<CheckInData[]>([])
    const [partCodeData, setPartCodeData] = useState<PartyCodeData[]>([])
    let [isUploadPending, startUploadTransition] = useTransition();
    const router = useRouter();

    const toast = useRef<Toast>(null);

    // const upload = () => {
         
    //     startUploadTransition(() => {

    //             if (dataType == 'CheckIn'){
    //                 handleUploadCheckIn(checkInData, password);
    //             } else {
    //                 handleUploadPartyCode(partCodeData, password)
    //             }
                
    //             toast.current?.show({
    //                 severity:'success',
    //                 detail: 'Upload Successfully'
    //             })
    //             reset()
    //         }
    //     )
    // }


   
        
        







    const onSubmit = (data: UploadFormData) => {
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
                    
                        <Button disabled={!isValid} type="submit" label="Upload" severity="success"></Button>
                        <Button onClick={()=>router.back()} label="Cancel" severity="info"></Button>
                    </div>
                </form>
                            
                }
            </div>
                    
        </Card>  
    )
}