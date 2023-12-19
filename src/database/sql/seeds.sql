-- en purchases cambiar user_id y user_seller_id por client_id y seller_id
BEGIN;
INSERT INTO users (user_card_id, name, email, password, rol, created_at)
  VALUES 
    (123456789, 'John Doe', '5656', 'secretpassword', 'admin', '2023-01-01'),
    (NULL, 'Jane Smith', NULL, 'anotherpassword', 'client', '2023-01-02'),
    (NULL, 'Bob Johnson', 'john.edoe@example.com', NULL, 'client', '2023-01-03'),
    (NULL, 'Alice Williams', 'alice.williams@example.com', '4567', 'admin', '2023-01-04'),
    (987654321, 'Charlie Brown', 'charlie.brown@example.com', 'charliepassword', 'client', '2023-01-05');


INSERT INTO products (name, unit_measure, volume, sale_price, brand, available_units)
  VALUES 
    ('Product A', 'kg', 2.5, 20, 'Brand X',0),
    ('Product B', 'l', 1.0, 15, 'Brand Y',0),
    ('Product C', 'unidades', 10.0, 5, 'Brand Z',0),
    ('Product D', 'g', 500.0, 30, 'Brand X',0),
    ('Product E', 'ml', 750.0, 25, 'Brand Y',0),
    ('Product F', 'kg', 1.0, 40, 'Brand Z',0),
    ('Product G', 'l', 2.0, 18, 'Brand X',0),
    ('Product H', 'ml', 500.0, 12, 'Brand Y',0),
    ('Product I', 'kg', 3.0, 25, 'Brand Z',0),
    ('Product J', 'unidades', 5.0, 8, 'Brand X',0);


INSERT INTO buy (admin_id, product_id, units, date, price)
  VALUES 
    (1, 1, 5, '2023-01-01', 100.00),
    (1, 3, 10, '2023-01-02', 50.00),
    (4, 2, 2, '2023-01-03', 30.00),
    (4, 5, 3, '2023-01-04', 75.00),
    (1, 4, 8, '2023-01-05', 120.00),
    (4, 6, 1, '2023-01-06', 40.00),
    (1, 8, 5, '2023-01-07', 60.00),
    (4, 10, 4, '2023-01-08', 32.00),
    (1, 1, 5, '2023-01-01', 100.00),
    (1, 3, 10, '2023-01-02', 50.00),
    (4, 2, 2, '2023-01-03', 30.00),
    (4, 5, 3, '2023-01-04', 75.00),
    (1, 4, 8, '2023-01-05', 120.00),
    (4, 6, 1, '2023-01-06', 40.00),
    (1, 8, 5, '2023-01-07', 60.00),
    (4, 10, 4, '2023-01-08', 32.00),
    (1, 1, 5, '2023-01-01', 100.00),
    (1, 3, 10, '2023-01-02', 50.00),
    (4, 2, 2, '2023-01-03', 30.00),
    (4, 5, 3, '2023-01-04', 75.00),
    (1, 4, 8, '2023-01-05', 120.00),
    (4, 6, 1, '2023-01-06', 40.00),
    (1, 8, 5, '2023-01-07', 60.00),
    (4, 10, 4, '2023-01-08', 32.00),
    (1, 1, 5, '2023-01-01', 100.00),
    (1, 3, 10, '2023-01-02', 50.00),
    (4, 2, 2, '2023-01-03', 30.00),
    (4, 5, 3, '2023-01-04', 75.00),
    (1, 4, 8, '2023-01-05', 120.00),
    (4, 6, 1, '2023-01-06', 40.00),
    (1, 8, 5, '2023-01-07', 60.00),
    (4, 10, 4, '2023-01-08', 32.00);

INSERT INTO purchases (client_id, seller_id)
  VALUES 
    (2, 1),
    (3, 1),
    (5, 4),
    (2, 4),
    (3, 1),
    (5, 4),
    (2, 1),
    (3, 4);


INSERT INTO purchase_details (client_id, purchase_id, product_id, loaded_units)
  VALUES 
    (5, 3, 5, 1),
    (2, 1, 5, 1),
    (2, 1, 1, 5),
    (2, 1, 2, 1),
    (3, 2, 2, 1),
    (3, 2, 4, 2),
    (3, 2, 6, 1),
    (5, 3, 8, 1),
    (5, 3, 3, 1),
    (2, 4, 10, 1),
    (2, 4, 1, 1),
    (2, 4, 2, 1),
    (3, 5, 3, 1),
    (3, 5, 4, 1),
    (3, 5, 5, 1),
    (5, 6, 6, 1),
    (5, 6, 2, 1),
    (5, 6, 8, 1),
    (2, 7, 4, 1),
    (2, 7, 10, 1),
    (2, 7, 1, 1),
    (3, 8, 2, 1),
    (3, 8, 3, 1),
    (3, 8, 4, 1);

INSERT INTO payments (date, amount, currency, reference, exchange_rate, payment_method)
  VALUES 
    ('2023-01-01', 100.00, 'USD', '1', 35.72, 'efectivo'),
    ('2023-01-02', 50.00, 'VES', '12', 35.72, 'efectivo'),
    ('2023-01-03', 30.00, 'USD', '2', 35.72, 'efectivo'),
    ('2023-01-04', 75.00, 'VES', '23', 35.72, 'efectivo'),
    ('2023-01-05', 120.00, 'USD', '13', 35.72, 'efectivo'),
    ('2023-01-06', 40.00, 'VES', '24', 35.72, 'efectivo'),
    ('2023-01-07', 60.00, 'USD', '14', 35.72, 'efectivo'),
    ('2023-01-08', 32.00, 'VES', '25', 35.72, 'efectivo');

INSERT INTO correspond (payment_id, client_id, purchase_id)
  VALUES 
    (1, 2, 1),
    (2, 3, 2),
    (3, 5, 3),
    (4, 2, 4),
    (5, 3, 5),
    (6, 5, 6),
    (7, 2, 7),
    (8, 3, 8);

COMMIT;
