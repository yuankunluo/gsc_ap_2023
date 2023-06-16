'use client' // Error components must be Client Components
 
import { useRouter } from 'next/navigation'
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

 
export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  
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
        <p className="m-0">
          {`${error}`}
        </p>
    </Card>
    
  )
}