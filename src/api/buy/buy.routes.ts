/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'

// Schemas
import { BuyUpdateSchema, BuySchema } from './buy.schema'

// Middlewares
import { schemaGuard } from '../../middlewares/schemaGuard'

// Controllers
import { getAllBuys } from './actions/get-all.action'
import { addBuy } from './actions/add.action'
import { deleteBuy } from './actions/delete.action'
import { updateBuy } from './actions/update.action'

const router = Router()

router.get('/all', getAllBuys)
router.post('/add', schemaGuard(BuySchema), addBuy)
router.put('/:buyIdx/:productId', schemaGuard(BuyUpdateSchema), updateBuy)
router.delete('/:buyIdx', deleteBuy)

export default router
