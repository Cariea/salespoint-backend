import { Response, Request } from 'express'
import { pool } from '../../../database/db'
import { STATUS } from '../../../utils/constants'
// import { handleControllerError } from '../../../utils/responses/handleControllerError'
import camelizeObject from '../../../utils/camelizeObject'

export const updatePurchaseDetail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // hay que validar aqui que la cantidad de unidades sea menor o igual que la actual mas las disponibles
    const { clientId, purchaseId, productId } = req.params
    const {
      loadedUnits
    } = req.body
    const { rows: availableUnitsResponse } = await pool.query({
      text: `
        SELECT
          available_units + 
          (SELECT 
            loaded_units 
            FROM purchase_details 
            WHERE purchase_id = $1 AND 
                  client_id = $2) AS available_units
        From products 
        WHERE product_id = $3;
      `,
      values: [purchaseId, clientId, productId]
    })
    console.log(availableUnitsResponse)
    console.log(typeof availableUnitsResponse)
    if (availableUnitsResponse[0].available_units < loadedUnits) {
      return res.status(STATUS.BAD_REQUEST).json({
        message: 'No hay suficientes unidades disponibles'
      })
    }
    const response = await pool.query({
      text: `
        UPDATE purchase_details
        SET
          loaded_units = $1
        WHERE client_id = $2
          AND purchase_id = $3
          AND product_id = $4
        RETURNING
          *
      `,
      values: [
        loadedUnits,
        clientId,
        purchaseId,
        productId
      ]
    })
    if (response.rowCount === 0) {
      return res.status(STATUS.NOT_FOUND).json({
        message: 'No se encontró el detalle de compra'
      })
    }
    return res.status(STATUS.OK).json(camelizeObject(response.rows[0]))
  } catch (error: unknown) {
    console.log(error)
    return res.status(STATUS.BAD_REQUEST).json({ message: error instanceof Error ? error.message : 'Error desconocido' })
  }
}
