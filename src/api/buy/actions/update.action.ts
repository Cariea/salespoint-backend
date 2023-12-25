import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const updateBuy = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { buyIdx, productId } = req.params
    const {
      units,
      date,
      price
    } = req.body

    const referenceUnitsResponse = await pool.query({
      text: `
        SELECT 
          units
        FROM buy
        WHERE buy_idx = $1
      `,
      values: [buyIdx]
    })
    if (referenceUnitsResponse.rowCount === 0) {
      return res.status(STATUS.NOT_FOUND).json({
        message: 'La compra no existe'
      })
    }
    const availableUnitsResponse = await pool.query({
      text: `
        SELECT 
          available_units
        FROM products
        WHERE product_id = $1
      `,
      values: [productId]
    })
    if (availableUnitsResponse.rowCount === 0) {
      return res.status(STATUS.NOT_FOUND).json({
        message: 'El producto no existe'
      })
    }
    if (units < referenceUnitsResponse.rows[0].units && referenceUnitsResponse.rows[0].units - units > availableUnitsResponse.rows[0].available_units) {
      return res.status(STATUS.BAD_REQUEST).json({
        message: 'No hay suficientes unidades disponibles'
      })
    }
    const response = await pool.query({
      text: `
        UPDATE buy
        SET
          units = $1,
          date = $2,
          price = $3
        WHERE buy_idx = $4
        RETURNING
          *
      `,
      values: [
        units,
        date,
        price,
        buyIdx
      ]
    })
    return res.status(STATUS.OK).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    return handleControllerError(error, res)
  }
}
