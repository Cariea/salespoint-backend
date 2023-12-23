import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const updatePurchaseDetail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { clientId, purchaseId, productId } = req.params
    const {
      loadedUnits,
      chargetPrice
    } = req.body
    const response = await pool.query({
      text: `
        UPDATE purchase_details
        SET
          loaded_units = $1,
          charget_price = $2
        WHERE client_id = $3
          AND purchase_id = $4
          AND product_id = $5
        RETURNING
          *
      `,
      values: [
        loadedUnits,
        chargetPrice,
        clientId,
        purchaseId,
        productId
      ]
    })
    if (response.rowCount === 0) {
      return res.status(STATUS.NOT_FOUND).json({
        message: 'No se encontró el detalle de compra'
      })
    }
    return res.status(STATUS.OK).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}