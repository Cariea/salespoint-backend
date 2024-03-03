/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'

// Schemas

// Middlewares

// Controllers
import { getDailySalesAmount } from './actions/getDailySalesAmount'
import { getHistoricalData } from './actions/getHistoricalData'

const router = Router()

router.get('/daily-sales-amount', getDailySalesAmount)
router.get('/historical-data', getHistoricalData)

export default router
