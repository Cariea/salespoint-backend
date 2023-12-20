import { z } from 'zod'

export const ProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Debe indicar un nombre')
    .max(64, 'El nombre no puede superar los 64 carácteres'),
  unitMeasure: z
    .enum(['kg', 'g', 'l', 'ml', 'unidades']),
  volume: z
    .number()
    .min(1, 'El volumen no puede ser menor que 1')
    .max(9999.99, 'El volumen no puede ser mayor a 9999.99'),
  salePrice: z
    .number()
    .min(1, 'El precio de venta no puede ser menir que 1')
    .max(999999.99, 'El precio de venta no puede ser mayor a 999999.99'),
  brand: z
    .string()
    .min(1, 'Debe indicar una marca')
    .max(64, 'La marca no puede superar los 64 carácteres'),
  availableUnits: z
    .number()
    .min(0, 'Las unidades disponibles no pueden ser negativas')
    .max(999999, 'Las unidades disponibles no pueden ser mayores a 999999')
    .optional()
})
