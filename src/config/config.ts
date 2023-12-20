/* eslint-disable @typescript-eslint/restrict-template-expressions */
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()
dotenv.config({ path: path.join(__dirname, '..', '..', `.env.${process.env.NODE_ENV}`) })
console.log(path.join(__dirname, '..', '..', `.env.${process.env.NODE_ENV}`))

// Server Config
export const PORT = process.env.PORT

// JWT Config
export const AUTH_SECRET = process.env.AUTH_SECRET
export const AUTH_EXPIRE = process.env.AUTH_EXPIRE
export const AUTH_ROUNDS = process.env.AUTH_ROUNDS
// Database Config
export const DATABASE_URL = process.env.DATABASE_URL
