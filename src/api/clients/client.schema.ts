import { z } from 'zod'

export const RegisterUserPayload = z.object({
  userId: z
    .number(),
  userCardId: z
    .number(),
  name: z
    .string()
    .min(1, 'Debe indicar un nombre')
    .max(64, 'El nombre no puede superar los 64 carácteres'),
  email: z
    .string()
    .email('Debe indicar un email válido')
    .min(1, 'Debe indicar un email')
    .max(64, 'El email no puede superar los 64 carácteres'),
  phoneNumber: z
    .string()
    .min(1, 'Debe indicar un número de teléfono')
    .max(16, 'El número de teléfono no puede superar los 16 carácteres'),
  residenceAddress: z
    .string()
    .min(1, 'Debe indicar una dirección de residencia')
    .max(128, 'La dirección de residencia no puede superar los 128 carácteres'),
  role: z.enum(['admin', 'client'])
})

export const RegisterClientSchema = RegisterUserPayload.pick({
  name: true
})
