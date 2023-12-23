/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { UserRole } from '../../../utils/enums/roles.enums'

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    console.log(req.body)
    const { userCardId, name, residenceAddress, phoneNumber, email } = req.body

    // Verficar la existencia de esa persona antes de crear

    const response = await pool.query({
      text: `
          INSERT INTO users (
            user_card_id,
            name, 
            email,
            role
          ) 
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `,
      values: [userCardId, name, email, UserRole.CLIENT]
    })

    await pool.query({
      text: `
          UPDATE clients
          SET
            phone_number = $2,
            residence_address = $3
          WHERE user_id = $1
        `,
      values: [response.rows[0].user_id, phoneNumber, residenceAddress]
    })

    return res.status(STATUS.CREATED).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    return handleControllerError(error, res)
  }
}
