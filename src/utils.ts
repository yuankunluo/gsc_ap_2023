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