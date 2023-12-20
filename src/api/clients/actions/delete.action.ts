import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import { StatusError } from '../../../utils/responses/status-error'

export const deleteClient = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { clientId } = req.params
    const response = await pool.query({
      text: `
        DELETE FROM clients
        WHERE user_id = $1
        RETURNING *
      `,
      values: [clientId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        message: `No se encontro el cliente de id: ${clientId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    return res.status(STATUS.OK).json({ message: 'Cliente eliminado correctamente' })
  } catch (error: unknown) {
    return handleControllerError(error, res)
  }
}
