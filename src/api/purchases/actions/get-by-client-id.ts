import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const getByClientId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { clientId } = req.params
    const response = await pool.query({
      text: `
        SELECT 
          *
        FROM purchases
        WHERE client_id = $1
      `,
      values: [clientId]
    })
    if (response.rowCount === 0) {
      return res.status(STATUS.NOT_FOUND).json({ message: `No se encontro la compra de id: ${clientId}` })
    }
    return res.status(STATUS.OK).json(camelizeObject(response.rows))
  } catch (error: unknown) {
    return handleControllerError(error, res)
  }
}
