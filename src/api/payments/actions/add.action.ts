/*  eslint-disable @typescript-eslint/restrict-template-expressions */
import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const addPayment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
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
        INSERT INTO payments (
          date,
          amount,
          currency,
          reference,
          exchange_rate,
          payment_method
        )
        VALUES ($1, $2, $3, $4, $5, $6)
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
        paymentMethod
      ]
    })
    return res.status(STATUS.CREATED).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    console.log(error)
    return handleControllerError(error, res)
  }
}
