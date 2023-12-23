/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'

// Schemas
import { PurchaseDetailSchema } from './purchase-details.schema'
// Middlewares
import { schemaGuard } from '../../middlewares/schemaGuard'

// Controllers
import { getAllDetails } from './actions/get-all.action'
import { getDetailById } from './actions/get-by-id.action'
import { addPurchaseDetail } from './actions/add.action'
import { deletePurchaseDetail } from './actions/delete.action'
// import { updatePurchaseDetail } from './actions/update.action'

const router = Router()

router.get('/all/:clientId/:purchaseId', getAllDetails)
router.get('/:clientId/:purchaseId/:productId', getDetailById)
router.post('/add', schemaGuard(PurchaseDetailSchema), addPurchaseDetail)
// router.put('/:clientId/:purchaseId/:productId', schemaGuard(PurchaseDetailUpdateSchema), updatePurchaseDetail) //Revisar
router.delete('/:clientId/:purchaseId/:productId', deletePurchaseDetail)

export default router
