import { Response, Request } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../../../database/db'
import { AUTH_EXPIRE, AUTH_SECRET } from '../../../config/config'
import { STATUS } from '../../../utils/constants'
import { User } from '../../../types/index'
import { StatusError } from '../../../utils/responses/status-error'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

const getLoginDataFromRequestBody = (req: Request): any[] => {
  const { email, password } = req.body
  const loginData = [email, password]
  return loginData
}

export const logIn = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const loginData = getLoginDataFromRequestBody(req)
    const { rows } = await pool.query({
      text: `
        SELECT
          user_id,
          name,
          email,
          password,
          role
        FROM admins
        WHERE
          email = $1
      `,
      values: [loginData[0]]
    })

    const data: User = camelizeObject(rows[0]) as User

    const isPasswordCorrect =
      rows.length > 0
        ? await bcrypt.compare(loginData[1], data.password)
        : false

    if (rows.length === 0 || !isPasswordCorrect) {
      throw new StatusError({
        message: 'Email o Contraseña Incorrecta',
        statusCode: STATUS.UNAUTHORIZED
      })
    }

    const userForToken = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role
    }

    const token = jwt.sign(userForToken, String(AUTH_SECRET), {
      expiresIn: String(AUTH_EXPIRE)
    })

    return res.status(STATUS.ACCEPTED).json({ ...userForToken, token })
  } catch (error: unknown) {
    return handleControllerError(error, res)
  }
}
