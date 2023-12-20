/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'

// Schemas
import { PaymentSchema } from './payment.schema'

// Middlewares
import { schemaGuard } from '../../middlewares/schemaGuard'

// Controllers
import { getAllPayments } from './actions/get-all.action'
import { getPaymentById } from './actions/get-by-id.action'
import { addPayment } from './actions/add.action'
import { deletePayment } from './actions/delete.action'
import { updatePayment } from './actions/update.action'

const router = Router()

router.get('/all', getAllPayments)
router.get('/:paymentId', getPaymentById)
router.post('/add', schemaGuard(PaymentSchema), addPayment)
router.put('/:paymentId', schemaGuard(PaymentSchema), updatePayment)
router.delete('/:paymentId', deletePayment)

export default router
