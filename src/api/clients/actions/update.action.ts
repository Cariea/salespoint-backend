import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import { StatusError } from '../../../utils/responses/status-error'
export const updateClient = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { clientId } = req.params
    const { userCardId, name, residenceAddress, phoneNumber, email } = req.body
    const response = await pool.query({
      text: `
        UPDATE clients
        SET
          user_card_id = $1,
          name = $2,
          email = $3,
          phone_number = $4,
          residence_address = $5
        WHERE user_id = $6
        RETURNING *
      `,
      values: [userCardId, name, email, phoneNumber, residenceAddress, clientId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        message: `No se encontro el usuario de id: ${clientId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    return res.status(STATUS.OK).json({ message: 'Cliente actualizado correctamente' })
  } catch (error: unknown) {
    return handleControllerError(error, res)
  }
}
