import { z } from 'zod'

export const PaymentSchema = z.object({
  clientId: z
    .number()
    .int()
    .positive('Debe indicar un cliente'),
  purchaseId: z
    .number()
    .int()
    .positive('Debe indicar una compra'),
  date: z
    .string()
    .optional(),
  amount: z
    .number()
    .min(1, 'Debe indicar un monto')
    .max(999999.99, 'El monto no puede superar los 999999.99'),
  currency: z
    .enum(['USD', 'VES']),
  reference: z
    .string()
    .min(1, 'Debe indicar una referencia')
    .max(64, 'La referencia no puede superar los 64 carácteres'),
  exchangeRate: z
    .number()
    .min(1, 'Debe indicar un tipo de cambio')
    .max(100, 'El tipo de cambio no puede superar los 100'),
  paymentMethod: z
    .enum(['efectivo', 'transferencia', 'tarjeta', 'pago movil', 'saldo a favor'])
})

export const PaymentUpdateSchema = PaymentSchema.omit({
  clientId: true,
  purchaseId: true
})
