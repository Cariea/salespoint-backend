import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const addProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, unitMeasure, volume, salePrice, brand } = req.body
    const response = await pool.query({
      text: `
        INSERT INTO products
          (name, unit_measure, volume, sale_price, brand, available_units)
        VALUES
          ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      values: [name, unitMeasure, volume, salePrice, brand, 0]
    })
    return res.status(STATUS.OK).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
