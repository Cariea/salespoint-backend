/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { LoginSchema, RegisterSchema } from './auth.schema'

// Middlewares
import { schemaGuard } from '../../middlewares/schemaGuard'

// Controllers
import { signUp } from './actions/register.action'
import { logIn } from './actions/login.action'

const router = Router()

router.post('/register', schemaGuard(RegisterSchema), signUp)
router.post('/login', schemaGuard(LoginSchema), logIn)

export default router
