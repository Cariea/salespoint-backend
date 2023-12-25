import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const addBuy = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      adminId,
      productId,
      units,
      date,
      price
    } = req.body

    const response = await pool.query({
      text: `
        INSERT INTO buy (
          admin_id,
          product_id,
          units,
          date,
          price
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          *
      `,
      values: [
        adminId,
        productId,
        units,
        date,
        price
      ]
    })
    return res.status(STATUS.CREATED).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
