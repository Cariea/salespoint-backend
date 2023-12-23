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
