import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const getHistoricalData = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { rows } = await pool.query(
    `SELECT
      COALESCE(SUM(CASE WHEN date_trunc('day', date) = date_trunc('day', CURRENT_DATE - INTERVAL '1 day') AND is_paid THEN total_purchase_amount ELSE 0 END), 0) AS total_sales_yesterday,
      COALESCE(SUM(CASE WHEN date_trunc('day', date) >= date_trunc('day', CURRENT_DATE - INTERVAL '1 week') AND is_paid THEN total_purchase_amount ELSE 0 END), 0) AS total_sales_this_week,
      COALESCE(SUM(CASE WHEN date_trunc('day', date) >= date_trunc('day', CURRENT_DATE - INTERVAL '1 month') AND is_paid THEN total_purchase_amount ELSE 0 END), 0) AS total_sales_this_month,
      COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE) AND is_paid THEN total_purchase_amount ELSE 0 END), 0) AS total_sales_this_year
    FROM purchases;
  `
    )
    return res.status(STATUS.OK).json(camelizeObject(rows[0]))
  } catch (error) {
    return handleControllerError(error, res)
  }
}
