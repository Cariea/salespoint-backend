-- 1 Este query muestra el monto total de cada compra de un cliente
SELECT sum(total_item_amount) 
  FROM purchase_details 
  WHERE client_id = 2 and purchase_id = 1
GROUP BY(purchase_id);

-- 2 Este query muestra el balance de un cliente
SELECT
    (SELECT SUM(amount_in_usd) FROM payments WHERE client_id = 2) -
    (SELECT SUM(total_purchase_amount) FROM purchases WHERE client_id = 2) AS difference;

SELECT
    available_units + (SELECT loaded_units FROM purchase_details WHERE purchase_id = 1 AND client_id = 2) AS available_units From products WHERE product_id = 1;