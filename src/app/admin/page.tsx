'use client'

import { useRef, useState, useTransition } from "react"
import { UploadData, handleUpload } from "./handler";
import Papa from 'papaparse';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { stringify } from "querystring";

export default function AdminPage(){

    const [password, setPassword] = useState('')
    const [uploadData, setUploadData] = useState<UploadData[]>([])
    const [error, setError] = useState('')
    let [isPending, startTransition] = useTransition();

    const toast = useRef(null);

    const upload = () => {
         
        startTransition(() => {
           handleUpload(uploadData, password)
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
            return
        }

        if (error.length > 0){
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
            return
        }

        setUploadData(data);

    }
        

    const reset = () => {
        setError('')
        setPassword('')
        setUploadData([])

    }



    return (
        <div className="grid grid-cols-1 gap-6">


            <span className="p-float-label">
                <InputText aria-label="Choose File" id="upload_input" type="file" name="upload_file"
                    onChange={(e) => {
                        
                        if (e.target.files && e.target.files.length > 0){
                            const file = e.target.files[0]
                            file.text().then(
                                csv =>parseCsv(csv)
                            ).catch(error => {
                                console.error(error)
                            })
                        } else {
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
            

            <Button severity="danger" disabled={uploadData.length == 0 || password.length == 0} onClick={(e) => upload()}>Upload, Erase old data!!</Button>

            <Button severity="warning" onClick={(e) => reset()}>Reset</Button>
           

        

            {error? 

                <Message  text={error} severity="error"/>
                :
                <br/>
                }
                
        </div>  
    )
}