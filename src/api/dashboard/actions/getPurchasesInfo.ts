import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const getAllPurchases = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    let { serchString } = req.query

    if (serchString?.length === 0 || serchString === undefined) {
      serchString = ''
    }

    const response = await pool.query({
      text: `
        SELECT 
          c.name AS name,
          c.user_card_id AS client_id,
          p.purchase_id AS purchase_id,
          p.total_purchase_amount AS amount,
          TO_CHAR(p.date, 'DD-MM-YYYY') AS date,
          p.is_paid as status
        FROM 
          clients c
        JOIN 
          purchases p ON c.user_id = p.client_id    
        ORDER BY p.date DESC
      `
    })
    if (response.rowCount === 0) {
      return res.status(STATUS.NOT_FOUND).json({
        message: 'No se encontraron compras'
      })
    }
    return res.status(STATUS.OK).json(camelizeObject(response.rows))
  } catch (error: unknown) {
    return handleControllerError(error, res)
  }
}
