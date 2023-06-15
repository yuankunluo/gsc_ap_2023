'use client'

import { useRef, useState, useTransition } from "react"
import { UploadData, handleUpload } from "./handler";
import Papa from 'papaparse';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';

export default function AdminPage(){

    const [password, setPassword] = useState('')
    const [uploadData, setUploadData] = useState([])
    const [error, setError] = useState('')
    let [isPending, startTransition] = useTransition();

    const toast = useRef(null);

    const upload = () => {
        
        

        // if (!founded){
        //     setError(`Required fileds not found, required: ${requiredFileds}`)
        //     return
        // }

        // if (errors.length > 0){
        //     setError(`Parser Errors: ${errors}`)
        //     return
        // }
        
        // startTransition(() => {
        //    handleUpload(data, password)
        // })
    }


    const parseCsv = (csv: string) => {
        const {data, errors, meta} = Papa.parse<UploadData>(csv, {
            header: true,
        })

        const requiredFileds = ['code','seat']

        const founded = requiredFileds.map((f) => meta.fields?.includes(f)).reduce((a,b) => a && b, true)

        if (!founded){
            setError("required filed missing")
            return
        }

        console.log(data)

    }
        

    const reset = () => {
        setError('')
        setPassword('')
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
            

            <Button onClick={(e) => upload()}>Upload</Button>

            <Button severity="info" onClick={(e) => reset()}>Reset</Button>
           

        

            {error? 

                <Message  text={error} severity="error"/>
                :
                <br/>
                }
                
        </div>  
    )
}