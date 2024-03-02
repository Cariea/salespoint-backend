import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
// import camelizeObject from '../../../utils/camelizeObject'

// CREATE TABLE purchases (
//   client_id INTEGER,
//   purchase_id INTEGER GENERATED ALWAYS AS IDENTITY,
//   date dom_created_at NOT NULL,
//   total_purchase_amount numeric(8,2) NOT NULL DEFAULT 0,
//   is_paid BOOLEAN NOT NULL DEFAULT FALSE,
//   seller_id INTEGER NOT NULL,
//   CONSTRAINT purchases_pk PRIMARY KEY (client_id, purchase_id),
//   CONSTRAINT purchases_fk FOREIGN KEY (client_id)
//    REFERENCES users (user_id)
//     ON UPDATE CASCADE
//     ON DELETE RESTRICT,
//   CONSTRAINT purchases_fk_seller FOREIGN KEY (seller_id)
//    REFERENCES admins (user_id)
//     ON UPDATE CASCADE
//     ON DELETE RESTRICT
// );

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
    return res.status(STATUS.OK).json({ totalCashAmount: Number(rows[0].total_cash_amount), totalCreditAmount: Number(rows[0].total_credit_amount) })
  } catch (error) {
    return handleControllerError(error, res)
  }
}
