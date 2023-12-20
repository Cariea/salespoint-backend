--1 Este query muesta en una variable llamada rest la cantidad de dinero restante de un pago

SELECT p.amount_in_usd - sum(c.amount_paid) as rest 
  FROM payments p 
  INNER JOIN correspond c 
    ON p.payment_id = c.payment_id 
WHERE c.client_id = 3 AND c.purchase_id = 3
 GROUP BY(p.amount_in_usd);

--2 Este query muestra en una variable llamada total_paid la cantidad de dinero abonada a una compra

SELECT SUM(amount_paid) as total_paid 
  FROM correspond 
  WHERE client_id = 3 
  AND purchase_id = 3;

--3 Este query muestra en una variable llamada total el monto total a pagar de una compra

SELECT SUM(total_item_amount) as total
  FROM purchase_details 
  WHERE client_id = 3
  AND purchase_id = 3;

--4 Este query muestra la cantidad de dinero que resta por pagar de una compra
SELECT SUM(total_item_amount) - (
    SELECT SUM(amount_paid)
    FROM correspond
    WHERE client_id = 3
      AND purchase_id = 3
) as total
FROM purchase_details
WHERE client_id = 3
  AND purchase_id = 3;

-- 5 Este query muestra el monto total de cada compra de un cliente
SELECT sum(total_item_amount) 
  FROM purchase_details 
  WHERE client_id = 5 and purchase_id = 3;
GROUP BY(purchase_id);