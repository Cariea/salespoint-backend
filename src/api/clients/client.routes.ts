/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { RegisterClientSchema } from './client.schema'

// Middlewares
import { schemaGuard } from '../../middlewares/schemaGuard'

// Controllers
import { signUp } from '../clients/actions.ts/register.action'

const router = Router()

router.post('/register', schemaGuard(RegisterClientSchema), signUp)

export default router
