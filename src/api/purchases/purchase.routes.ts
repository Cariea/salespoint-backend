/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'

// Schemas
import { PurchaseSchema } from './purchase.schema'

// Middlewares
import { schemaGuard } from '../../middlewares/schemaGuard'

// Controllers
import { getAllPurchases } from './actions/get-all.action'
import { getByPurchaseId } from './actions/get-by-id.action'
import { deletePurchase } from './actions/delete.action'
import { addPurchase } from './actions/add.action'
import { getByClientId } from './actions/get-by-client-id'

const router = Router()

router.get('/all', getAllPurchases)
router.post('/add', schemaGuard(PurchaseSchema), addPurchase)
router.get('/client/:clientId', getByClientId)
router.get('/:purchaseId', getByPurchaseId)
router.delete('/:purchaseId', deletePurchase)

export default router
