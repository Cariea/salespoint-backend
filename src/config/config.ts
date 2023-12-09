/* eslint-disable @typescript-eslint/restrict-template-expressions */
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()
dotenv.config({ path: path.join(__dirname, '..', '..', `.env.${process.env.NODE_ENV}`) })
console.log(path.join(__dirname, '..', '..', `.env.${process.env.NODE_ENV}`))

export const PORT = process.env.PORT
