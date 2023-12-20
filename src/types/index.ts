import { z } from 'zod'

import { RegisterSchema, RegisterUserPayload } from '../api/auth/auth.schema'

export type User = z.infer<typeof RegisterUserPayload>
export type UserPayload = z.infer<typeof RegisterSchema>
