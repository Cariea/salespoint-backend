/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'

// Schemas

// Middlewares

// Controllers
import { getDailySalesAmount } from './actions/getDailySalesAmount'

const router = Router()

router.get('/daily-sales-amount', getDailySalesAmount)

export default router
