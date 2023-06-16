import postgres  from 'postgres'

// will use psql environment variables
const sql = postgres(process.env.POSTGRES_URL) 

export const peopleCheckInTable = `${process.env.DB_TABLE_PREFIX}_people_check_in`

export default sql