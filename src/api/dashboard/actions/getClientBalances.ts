import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const getClientBalances = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { rows } = await pool.query(
      `SELECT
        c.user_id,
        c.user_card_id AS card_id,
        c.name AS name,
        COALESCE(
            (SELECT SUM(amount_in_usd) FROM payments py WHERE py.client_id = c.user_id),
            0
        ) -
        COALESCE(
            (SELECT SUM(total_purchase_amount) FROM purchases p WHERE p.client_id = c.user_id),
            0
        ) AS balance
      FROM
          clients c
      ORDER BY
        c.user_id
  `
    )
    return res.status(STATUS.OK).json(camelizeObject(rows))
  } catch (error) {
    return handleControllerError(error, res)
  }
}

// COALESCE(
//   (SELECT SUM(amount_in_usd) FROM payments py WHERE py.client_id = c.user_id),
//   0
// ) AS total_payments,
// COALESCE(
//   (SELECT SUM(total_purchase_amount) FROM purchases p WHERE p.client_id = c.user_id),
//   0
// ) AS total_purchases,
