import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'
export const deleteBuy = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { buyIdx } = req.params
    const response = await pool.query({
      text: `
        DELETE FROM buy
        WHERE buy_idx = $1
        RETURNING
          *
      `,
      values: [
        buyIdx
      ]
    })
    if (response.rowCount === 0) {
      return res.status(STATUS.NOT_FOUND).json({
        message: 'No se encontró la compra'
      })
    }
    return res.status(STATUS.OK).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    return handleControllerError(error, res)
  }
}
