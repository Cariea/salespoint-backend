import { z } from 'zod'

export const PurchaseSchema = z.object({
  clientId: z
    .number()
    .int()
    .positive('Debe indicar un cliente'),
  date: z
    .string()
    .optional()
})
