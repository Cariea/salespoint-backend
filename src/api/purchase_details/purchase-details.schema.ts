import { z } from 'zod'

export const PurchaseDetailSchema = z.object({
  clientId: z
    .number()
    .int()
    .positive('Debe indicar un cliente'),
  purchaseId: z
    .number()
    .int()
    .positive('Debe indicar una compra'),
  productId: z
    .number()
    .int()
    .positive('Debe indicar un producto'),
  loadedUnits: z
    .number()
    .int()
    .positive('Debe indicar las unidades cargadas')
})

export const PurchaseDetailUpdateSchema = PurchaseDetailSchema.omit({
  clientId: true,
  purchaseId: true,
  productId: true
})
