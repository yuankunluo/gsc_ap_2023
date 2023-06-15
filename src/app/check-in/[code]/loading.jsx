'use client'


import { ProgressSpinner } from 'primereact/progressspinner';


export default function Loading() {
    return <div>
        <ProgressSpinner />
        <p>Checking In... 正在签到...</p>
    </div>
}