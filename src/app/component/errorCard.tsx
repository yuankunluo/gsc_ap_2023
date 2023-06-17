'use client'

import { useRouter } from 'next/navigation'
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';


export default function ErrorCard(props: {
    errorMessage: string
    errorName: string
}){


    const router = useRouter()

    const onCancel = () =>{
        router.push("/")
      }
    
      const onRetry = () => {
        router.back();
      }

    const footer = (
        <div className="flex flex-wrap justify-content-end gap-2">
              <Button label="Retry" onClick={onRetry} />
              <Button label="Cancel" onClick={onCancel}  className="p-button-outlined p-button-secondary" />
          </div>
    )
  
    return (
        <Card title="错误" subTitle="遇到了问题" footer={footer} className="md:w-25rem">
          
            <h1>{props.errorName}</h1>
            <Message severity="error" text={props.errorMessage} />
      </Card>
      
    )

}