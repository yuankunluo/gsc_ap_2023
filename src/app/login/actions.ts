'use server'

import { AuthUser, signJWT, AUTH_HEADER } from '@/utils'
import { cookies } from 'next/headers'

export interface LoginResponse {
    errorMessage?: string
}


export async function logout(){
    cookies().delete(AUTH_HEADER)
}


export async function login(password: string){

    const response: LoginResponse = {}

    const MASTER_PASSWORD = process.env.MASTER_PASSWORD
    const USER_PASSWORD = process.env.USER_PASSWORD?.split(",")

    if (password == MASTER_PASSWORD){
        const authUser: AuthUser = {
            username: 'superuser',
            role: 'admin'
        }
        const jwtToken = await signJWT(authUser)
        cookies().set(AUTH_HEADER, jwtToken)
    } else if (USER_PASSWORD?.includes(password)){
        const authUser: AuthUser = {
            username: 'user_' + password.substring(4),
            role: 'admin'
        }
        const jwtToken = await signJWT(authUser)
        cookies().set(AUTH_HEADER, jwtToken)

    } else {
        response.errorMessage = "登录失败！"
        cookies().delete(AUTH_HEADER)
    } 

    return response
}