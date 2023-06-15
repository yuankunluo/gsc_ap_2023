'use client'

import { useState, useTransition } from "react"
import { handleUpload } from "./handler";


export default function AdminPage(){

    const [password, setPassword] = useState('')
    const [uploadFile, setUploadFile] = useState('')
    let [isPending, startTransition] = useTransition();

    const upload = () => {
        console.log(password)
        console.log(uploadFile)
        startTransition(() => {
           handleUpload(uploadFile, password)
        })
    }
        
    return (
        <div className="grid">
           <form onSubmit={(e) => e.preventDefault()}>

                <input type="file" name="upload_file" onChange={(v) => {
                    if (v.target.files){
                        let f = v.target.files[0]
                        f.text().then(data => 
                            setUploadFile(data)
                            ).catch(error => {
                                console.error(error)
                            })
                    } else {
                        setUploadFile('')
                    }
                }} />

                <input type="password" name="password" onChange={(v) => setPassword(v.target.value)}/>
                
                <button disabled={password === '' || uploadFile === ''} onClick={(e) => upload()}>Upload</button>
           </form>
        </div>  
    )
}