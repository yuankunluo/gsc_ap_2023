'use client' // Error components must be Client Components
 
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  
  const router = useRouter()
 
  return (
    <div>
      <h2>Something went wrong!</h2>
      <h2>{`${error}`}</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          ()=>router.back()
        }
      >
        Try again
      </button>
    </div>
  )
}