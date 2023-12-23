/*  eslint-disable @typescript-eslint/restrict-template-expressions */
import { Response } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
import { ExtendedRequest } from '../../../middlewares/auth'

export const addPurchase = async (
  req: ExtendedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { clientId, date } = req.body
    if (date === undefined) {
      const response = await pool.query({
        text: `
          INSERT INTO purchases (
            client_id,
            seller_id
          )
          VALUES ($1, $2)
          RETURNING
            *
        `,
        values: [clientId, req.user?.id]
      })
      return res.status(STATUS.CREATED).json(camelizeObject(response.rows[0]))
    }
    const response = await pool.query({
      text: `
        INSERT INTO purchases (
          client_id,
          date,
          seller_id
        )
        VALUES ($1, $2, $3)
        RETURNING
          *
      `,
      values: [clientId, date, req.user?.id]
    })

    return res.status(STATUS.CREATED).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
