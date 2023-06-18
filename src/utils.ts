import moment from "moment-timezone";

const DATE_FORMAT= "YYYY-MM-DD HH:mm:ss"
const TIME_ZONE = 'Asia/Shanghai'

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