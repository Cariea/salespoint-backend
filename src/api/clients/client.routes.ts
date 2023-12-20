/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { RegisterClientSchema } from './client.schema'

// Middlewares
import { schemaGuard } from '../../middlewares/schemaGuard'

// Controllers
import { signUp } from '../clients/actions.ts/register.action'
import { getAllClients } from '../clients/actions.ts/get-all.action'
import { getClientByCardId } from './actions.ts/get-by-cardId.action'
import { updateClient } from './actions.ts/update.action'
import { deleteClient } from './actions.ts/delete.action'

const router = Router()

router.get('/all', getAllClients)
router.get('/:cardId', getClientByCardId)
router.post('/register', schemaGuard(RegisterClientSchema), signUp)
router.put('/:clientId', updateClient)
router.delete('/:clientId', deleteClient)

export default router
