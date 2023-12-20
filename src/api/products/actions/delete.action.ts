import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
import { handleControllerError } from '../../../utils/responses/handleControllerError'
import { StatusError } from '../../../utils/responses/status-error'

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { productId } = req.params
    const response = await pool.query({
      text: `
        DELETE FROM products
        WHERE product_id = $1
        RETURNING *
      `,
      values: [productId]
    })
    if (response.rowCount === 0) {
      throw new StatusError({
        message: `No se encontro el producto de id: ${productId}`,
        statusCode: STATUS.NOT_FOUND
      })
    }
    return res.status(STATUS.OK).json({ message: 'Producto eliminado correctamente' })
  } catch (error: unknown) {
    return handleControllerError(error, res)
  }
}
