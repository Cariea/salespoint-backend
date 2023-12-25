// CREATE TABLE buy (
//   admin_id INTEGER,
//   buy_idx INTEGER GENERATED ALWAYS AS IDENTITY,
//   product_id INTEGER,
//   units INTEGER NOT NULL,
//   date dom_created_at,
//   price dom_amount NOT NULL,
//   CONSTRAINT buy_pk PRIMARY KEY (admin_id, buy_idx),
//   CONSTRAINT buy_fk_admin FOREIGN KEY (admin_id)
//    REFERENCES admins (user_id)
//     ON UPDATE CASCADE
//     ON DELETE RESTRICT,
//   CONSTRAINT buy_fk_product FOREIGN KEY (product_id)
//    REFERENCES products (product_id)
//     ON UPDATE CASCADE
//     ON DELETE RESTRICT
// );
import z from 'zod'
export const BuySchema = z.object({
  adminId: z
    .number()
    .int()
    .positive(),
  productId: z
    .number()
    .int()
    .positive(),
  buyIdx: z
    .number()
    .int()
    .positive()
    .optional(),
  units: z
    .number()
    .int()
    .positive(),
  date: z
    .string(),
  price: z
    .number()
    .int()
    .positive()
})

export const BuyUpdateSchema = BuySchema.omit({ adminId: true, productId: true })
