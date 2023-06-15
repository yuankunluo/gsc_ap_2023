"use client"

import { useRouter } from "next/navigation"


export function Header(){

    const router = useRouter()


    return (
        <div id="header" className="z-10 backdrop-blur top-0 left-0 w-full h-28 fixed flex justify-center items-center py-2">
            <img onClick={()=>{
                router.push("/")
            }} alt="logo" src="/logo.png" className="h-24"/>
        </div>
    )
}