'use client'

import React, { useRef } from 'react';


export default function AdminPage(){

    const toast = useRef(null);

    const onUpload = () => {
       
    };
        
    return (
        <div className="card flex justify-content-center">
           <form>
            <input type="file" name="file"></input>
           </form>
        </div>  
    )
}