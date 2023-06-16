'use client'


import { ProgressSpinner } from 'primereact/progressspinner';


export default function Loading() {
    return <div>
        <ProgressSpinner />
        <p>Porcessing ...</p>
    </div>
}