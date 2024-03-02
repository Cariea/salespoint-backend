import { Router } from 'express'

// Middlewares
import { tokenGuard } from '../../middlewares/tokenGuard'
import { verifyToken } from '../../middlewares/auth'

// Routers
import authRouter from '../auth/auth.routes'
import clientsRouter from '../clients/client.routes'
import productsRouter from '../products/product.routes'
import paymentRouter from '../payments/payment.routes'
import purchaseRouter from '../purchases/purchase.routes'
import purchaseDetailsRouter from '../purchase_details/purchase-details.routes'
import buyRouter from '../buy/buy.routes'
import dashboardRoutes from '../dashboard/dashboard.routes'
export const router = Router()

// Test endpoint
router.get('/ping', (_req, res) => {
  res.status(200).json({ test: 'todo piola' })
})

// Public Routes
router.use('/auth', authRouter)

// Middlewares for token validation
router.use(tokenGuard(), verifyToken())

// Secured by token validation endpoints
router.use('/clients', clientsRouter)
router.use('/products', productsRouter)
router.use('/payments', paymentRouter)
router.use('/purchases', purchaseRouter)
router.use('/purchase-details', purchaseDetailsRouter)
router.use('/buy', buyRouter)
router.use('/dashboard', dashboardRoutes)
