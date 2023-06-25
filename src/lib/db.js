import postgres  from 'postgres'

// will use psql environment variables
const sql = postgres(process.env.POSTGRES_URL) 

export const checkInTabble = `${process.env.DB_TABLE_PREFIX}_check_in`
export const partyCodeTable = `${process.env.DB_TABLE_PREFIX}_party_code`
export const checkInCodeTable = `${process.env.DB_TABLE_PREFIX}_check_in_code`
export const winnerListTable = `${process.env.DB_TABLE_PREFIX}_winner_list`

export default sql