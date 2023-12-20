import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const getByProductId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { productId } = req.params
    const response = await pool.query({
      text: `
        SELECT
          product_id,
          name,
          unit_measure,
          volume,
          sale_price,
          brand,
          available_units,
          updated_at
        FROM products
        WHERE product_id = $1
      `,
      values: [productId]
    })
    if (response.rowCount === 0) {
      return res.status(STATUS.NOT_FOUND).json({
        message: `No se encontro el producto con el id: ${productId}`
      })
    }
    return res.status(STATUS.OK).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    return handleControllerError(error, res)
  }
}
