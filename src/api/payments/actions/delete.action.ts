import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'

export const deletePayment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { paymentId } = req.params
    const response = await pool.query({
      text: `
        DELETE FROM payments
        WHERE payment_id = $1
      `,
      values: [paymentId]
    })
    if (response.rowCount === 0) {
      return res.status(STATUS.NOT_FOUND).json({
        message: 'No se encontró el pago'
      })
    }
    return res.status(STATUS.OK).json({
      message: 'Pago eliminado'
    })
  } catch (error: unknown) {
    return handleControllerError(error, res)
  }
}
