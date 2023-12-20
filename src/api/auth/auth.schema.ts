import { z } from 'zod'

export const RegisterUserPayload = z.object({
  userId: z
    .number(),
  name: z
    .string()
    .min(1, 'Debe indicar un nombre')
    .max(64, 'El nombre no puede superar los 64 carácteres'),
  email: z
    .string()
    .min(1, 'Debe indicar un correo electrónico')
    .max(64, 'El email no puede superar los 64 carácteres')
    .email(),
  password: z
    .string()
    .min(1, 'Debe indicar una contraseña')
    .max(64, 'La contraseña no puede superar los 64 carácteres'),
  role: z.enum(['admin', 'client'])
})

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Es necesario ingresar un correo electrónico')
    .max(64, 'El nombre debe ser menor a 64 carácteres')
    .email(),
  password: z
    .string()
    .min(1, 'Es necesario ingresar una contraseña')
    .max(64, 'El nombre debe ser menor a 64 carácteres')
})

export const RegisterSchema = RegisterUserPayload.pick({
  name: true,
  email: true,
  password: true
})
