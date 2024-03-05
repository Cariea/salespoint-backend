/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'

// Schemas

// Middlewares

// Controllers
import { getDailySalesAmount } from './actions/getDailySalesAmount'
import { getHistoricalData } from './actions/getHistoricalData'
import { getAllPurchases } from './actions/getPurchasesInfo'
import { getClientBalances } from './actions/getClientBalances'
const router = Router()

router.get('/daily-sales-amount', getDailySalesAmount)
router.get('/historical-data', getHistoricalData)
router.get('/purchases', getAllPurchases)
router.get('/client-balances', getClientBalances)

export default router
