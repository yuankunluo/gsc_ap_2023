'use client'

export default function Error({
    error,
    reset
}: {
    error: Error
    reset: () => void
  }

  ){

    <div>
    <h2>Something went wrong!</h2>
    <button
      onClick={
        // Attempt to recover by trying to re-render the segment
        () => reset()
      }
    >
      Try again
    </button>
  </div>


  }