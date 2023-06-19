import moment from "moment-timezone";
import { SignJWT, jwtVerify } from 'jose'

const DATE_FORMAT= "YYYY-MM-DD HH:mm:ss"
const TIME_ZONE = 'Asia/Shanghai'


export interface AuthUser {
    username: string
    role: string
  }
  
  

export const convertToDateString = (datestring: string | undefined, format_str=DATE_FORMAT) => {
    if (!datestring){
        return ''
    }
    return moment(datestring).format(format_str)
}

export const getNowTs = () => moment.tz(TIME_ZONE).toNow()


export function makeid(length:number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export function getRandom(min: number, max:number){
    return Math.floor(Math.random() * (max - min) + min);
}

const TOKEN_SECRET = process.env.TOKEN_SECRET ? process.env.TOKEN_SECRET : 'ilovegsc2023'
const secret = new TextEncoder().encode(
    TOKEN_SECRET,
)

const alg = 'HS256'
export const AUTH_HEADER = 'Authorization'

export async function signJWT(authUser: AuthUser){
  
    const jwt = await new SignJWT({username: authUser.username, role: authUser.role })
    .setProtectedHeader({ alg })
    .setIssuedAt(Date.now())
    .setExpirationTime('2h')
    .setSubject(authUser.username)
    .sign(secret)
  
    return jwt
  
  }
  
export async function verifyJWT(token: string){
    const { payload, protectedHeader } = await jwtVerify(token, secret)
    console.debug('jwt paylod', payload, protectedHeader)
    return payload
}