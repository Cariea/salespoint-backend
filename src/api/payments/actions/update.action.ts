import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const updatePayment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { paymentId } = req.params
    const {
      date,
      amount,
      currency,
      reference,
      exchangeRate,
      paymentMethod
    } = req.body
    const response = await pool.query({
      text: `
        UPDATE payments
        SET
          date = $1,
          amount = $2,
          currency = $3,
          reference = $4,
          exchange_rate = $5,
          payment_method = $6
        WHERE payment_id = $7
        RETURNING
          payment_id,
          date,
          amount,
          currency,
          reference,
          exchange_rate,
          payment_method,
          amount_in_usd
      `,
      values: [
        date,
        amount,
        currency,
        reference,
        exchangeRate,
        paymentMethod,
        paymentId
      ]
    })
    if (response.rowCount === 0) {
      return res.status(STATUS.NOT_FOUND).json({
        message: 'No se encontró el pago'
      })
    }
    return res.status(STATUS.OK).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    return handleControllerError(error, res)
  }
}
