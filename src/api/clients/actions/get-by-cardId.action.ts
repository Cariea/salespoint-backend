import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const getClientByCardId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { cardId } = req.params
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
        WHERE user_card_id = $1
      `,
      values: [cardId]
    })
    if (response.rowCount === 0) {
      return res.status(STATUS.NOT_FOUND).json({
        message: `No se encontro el cliente con el id: ${cardId}`
      })
    }
    return res.status(STATUS.OK).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    return handleControllerError(error, res)
  }
}
