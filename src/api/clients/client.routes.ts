/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'

// Schemas
import { RegisterClientSchema } from './client.schema'

// Middlewares
import { schemaGuard } from '../../middlewares/schemaGuard'

// Controllers
import { signUp } from './actions/register.action'
import { getAllClients } from './actions/get-all.action'
import { getClientByCardId } from './actions/get-by-cardId.action'
import { updateClient } from './actions/update.action'
import { deleteClient } from './actions/delete.action'

const router = Router()

router.get('/all', getAllClients)
router.get('/:cardId', getClientByCardId)
router.post('/register', schemaGuard(RegisterClientSchema), signUp)
router.put('/:clientId', updateClient)
router.delete('/:clientId', deleteClient)

export default router
