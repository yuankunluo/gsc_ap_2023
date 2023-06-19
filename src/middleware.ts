import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_HEADER, verifyJWT } from './utils'

export const config = {
  matcher: ['/admin/:path*'],
}


export async function middleware(request: NextRequest) {

    try {
      if (!request.cookies.has(AUTH_HEADER)){
        throw new Error('No Auth cookie')
      }
      const payload =  await verifyJWT(`${request.cookies.get(AUTH_HEADER)?.value}`)

      if (payload['role'] && payload['role'] == 'admin'){
        return NextResponse.next()
      } else {
        throw new Error("Not admin role")
      }

    } catch (error){
        console.error(error)
        return NextResponse.redirect(new URL('/login', request.url))
    }
 
  }