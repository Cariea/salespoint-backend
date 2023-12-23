import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const addPurchaseDetail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      clientId,
      purchaseId,
      productId,
      loadedUnits
    } = req.body

    const response = await pool.query({
      text: `
        INSERT INTO purchase_details (
          client_id,
          purchase_id,
          product_id,
          loaded_units
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          *
      `,
      values: [
        clientId,
        purchaseId,
        productId,
        loadedUnits
      ]
    })
    return res.status(STATUS.CREATED).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
