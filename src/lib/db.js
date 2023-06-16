import postgres  from 'postgres'

// will use psql environment variables
const sql = postgres(process.env.POSTGRES_URL) 

export default sql