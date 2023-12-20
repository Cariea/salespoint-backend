/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'

// Schemas
import { ProductSchema } from './product.schema'

// Middlewares
import { schemaGuard } from '../../middlewares/schemaGuard'

// Controllers
import { addProduct } from './actions/create.action'
import { getAllProducts } from './actions/get-all.action'
import { getByProductId } from './actions/get-by-id.action'
import { updateProduct } from './actions/update.action'
import { deleteProduct } from './actions/delete.action'

const router = Router()

router.get('/all', getAllProducts)
router.get('/:productId', getByProductId)
router.post('/add', schemaGuard(ProductSchema), addProduct)
router.put('/:productId', schemaGuard(ProductSchema), updateProduct)
router.delete('/:productId', deleteProduct)

export default router
