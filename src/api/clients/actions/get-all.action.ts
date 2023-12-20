import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const getAllClients = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const response = await pool.query({
      text: `
        SELECT
          user_id,
          user_card_id,
          name,
          email,
          phone_number,
          residence_address
        FROM clients
      `
    })
    if (response.rowCount === 0) {
      return res.status(STATUS.NOT_FOUND).json({
        message: 'No se encontraron clientes'
      })
    }
    return res.status(STATUS.OK).json(camelizeObject(response.rows))
  } catch (error: unknown) {
    return handleControllerError(error, res)
  }
}
