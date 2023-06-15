import postgres  from 'postgres'

const sql = postgres(process.env.POSTGRES_URL) // will use psql environment variables

export default sql