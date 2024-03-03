import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'

export const getDailySalesAmount = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { rows } = await pool.query(
    ` SELECT
        SUM(CASE WHEN is_paid = TRUE THEN total_purchase_amount ELSE 0 END) AS total_cash_amount,
        SUM(CASE WHEN is_paid = FALSE THEN total_purchase_amount ELSE 0 END) AS total_credit_amount
      FROM
          purchases
      WHERE
        date >= CURRENT_DATE`
    )
    console.log(rows)
    if (rows[0].total_cash_amount === null && rows[0].total_credit_amount === null) {
      rows[0].total_cash_amount = 0
      rows[0].total_credit_amount = 0
    }
    return res.status(STATUS.OK).json({ totalCashAmount: Number(rows[0].total_cash_amount), totalCreditAmount: Number(rows[0].total_credit_amount) })
  } catch (error) {
    return handleControllerError(error, res)
  }
}
