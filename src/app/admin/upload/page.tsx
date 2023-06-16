'use client'

import { useRef, useState, useTransition } from "react"
import { UploadData, handleUpload } from "./handler";
import Papa from 'papaparse';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { useRouter } from "next/navigation";
import { Toast } from 'primereact/toast';


export default function Upload(){

    const [password, setPassword] = useState('')
    const [uploadData, setUploadData] = useState<UploadData[]>([])
    const [error, setError] = useState('')
    let [isUploadPending, startUploadTransition] = useTransition();
    const router = useRouter();

    const toast = useRef<Toast>(null);

    const upload = () => {
         
        startUploadTransition(() => {
           handleUpload(uploadData, password);
           toast.current?.show({
            severity:'success',
            detail: 'Upload Successfully'
           })
            }
        )
    }


    const parseCsv = (csv: string) => {
        
        const {data, errors, meta} = Papa.parse<UploadData>(csv, {
            header: true,
            skipEmptyLines: true,
            transform: (value) => value.toLocaleLowerCase()
        })

        console.log(data, error, meta)

        const requiredFileds = ['code','table_nr']

        const founded = requiredFileds.map((f) => meta.fields?.includes(f)).reduce((a,b) => a && b, true)

        if (!founded){
            setError("required filed missing")
            setUploadData([])
        }

        if (errors.length > 0){
            setError(`${JSON.stringify(errors)}`)
            setUploadData([])
        } else {
            setError('')
        }

        // check duplication
        const codeList = data.map(d => d.code)
        const codeSet = new Set(codeList)

        if (codeList.length != codeSet.size){
            setError('Found duplicated code')
            setUploadData([])
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

        setUploadData(data);

    }
        

    const reset = () => {
        setError('')
        setPassword('')
        setUploadData([])

    }


    const bottom = 
            <div className="flex gap-4">
                <Button severity="danger" disabled={uploadData.length == 0 || password.length == 0} onClick={(e) => upload()}>Upload, Erase old data!!</Button>
                <Button severity="warning" onClick={(e) => reset()}>Reset</Button>
                <Button severity="info" onClick={(e) => {
                    reset();
                    router.back()
                    }}>Cancel</Button>
            </div>



    return (
        <Card title="Upload File" 
            subTitle="A CSV file containing: code, table_nr, optional: name, seat_nr"
            footer={bottom}
            >

            <Toast ref={toast} />

            <div id="upload_file_area">
                            { isUploadPending?

                            <ProgressSpinner /> :
                            
                            <div className="grid grid-cols-1 gap-6">

                                    <span className="p-float-label">
                                        <InputText aria-label="Choose File" id="upload_input" type="file" name="upload_file"
                                            onChange={(e) => {
                                                
                                                if (e.target.files && e.target.files.length > 0 && e.target.files[0].type == 'text/csv'){
                                                    const file = e.target.files[0]
                                                    
                                                    file.text().then(
                                                        csv =>parseCsv(csv)
                                                    ).catch(error => {
                                                        console.error(error)
                                                    })
                                                } else {
                                                    toast.current?.show({
                                                        severity:'error',
                                                        detail:'Only support CSV file'
                                                    })
                                                    setUploadData([])
                                                }
                                            }}
                                        />
                                    </span>

                                    <span className="p-float-label">
                                        <InputText aria-label="Password" id="password" type="password" name="password" placeholder="Password" 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)}
                                            />
                                        <label htmlFor="password">Password</label>
                                    </span>

                            </div>  
                            }
            </div>
                    
        </Card>  
    )
}