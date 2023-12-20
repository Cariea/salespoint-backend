/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Response, Request } from 'express'
import bcrypt from 'bcrypt'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { StatusError } from '../../../utils/responses/status-error'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { AUTH_ROUNDS } from '../../../config/config'
import { UserRole } from '../../../utils/enums/roles.enums'

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    console.log(req.body)
    const { userCardId, name, email } = req.body
    let { password } = req.body
    const registerData = [email, password]

    // Verficar la existencia de esa persona antes de crear

    const { rows } = await pool.query({
      text: `
          SELECT *
          FROM users
          WHERE email = $1
        `,
      values: [registerData[0]]
    })

    if (rows.length > 0) {
      throw new StatusError({
        message: `Ya existe una cuenta con el email: ${registerData[0]}`,
        statusCode: STATUS.BAD_REQUEST
      })
    }

    password = await bcrypt.hash(registerData[1], Number(AUTH_ROUNDS))

    const response = await pool.query({
      text: `
          INSERT INTO users (
            user_card_id,
            name, 
            email, 
            password,
            role
          ) 
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `,
      values: [userCardId, name, email, password, UserRole.ADMIN]
    })

    return res.status(STATUS.CREATED).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
