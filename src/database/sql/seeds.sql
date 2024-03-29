-- en purchases cambiar user_id y user_seller_id por client_id y seller_id
BEGIN;
INSERT INTO users (user_card_id, name, email, password, role, created_at)
  VALUES 
    ('25559633', 'Carmelo Naim', 'carmelonaim30@gmail.com', '$2b$10$d0IPTsrzLl4uPiMM13B2DOhDFzEMZddOgB0N.QPTowEChDXKoPxdW', 'admin', '2023-01-01'),
    ('00000000', 'fake client 0', 'fakeemail0@gmail.com', NULL, 'client', '2023-01-02'),
    ('00000001', 'fake client 1', 'fakeemail1@gmail.com', NULL, 'client', '2023-01-03'),
    ('30001632', 'Manuel Naim', 'manuelnaim30@gmail.com', '$2b$10$d0IPTsrzLl4uPiMM13B2DOhDFzEMZddOgB0N.QPTowEChDXKoPxdW', 'admin', '2023-01-04'),
    ('00000002', 'fake client 2', 'fakeemail2@gmail.com', NULL, 'client', '2023-01-05');


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
    (1, 2, 55, '2024-02-01', 100.00),
    (1, 2, 55, '2024-02-01', 100.00),
    (1, 7, 55, '2024-02-01', 100.00),
    (1, 4, 55, '2024-02-01', 100.00),
    (1, 3, 10, '2024-02-02', 50.00),
    (4, 2, 2, '2024-02-03', 30.00),
    (4, 5, 3, '2024-02-04', 75.00),
    (1, 4, 8, '2024-02-05', 120.00),
    (4, 6, 1, '2024-02-06', 40.00),
    (1, 8, 5, '2024-02-07', 60.00),
    (4, 10, 4, '2024-02-08', 32.00),
    (1, 1, 5, '2024-02-01', 100.00),
    (1, 3, 10, '2024-02-02', 50.00),
    (4, 2, 2, '2024-02-03', 30.00),
    (4, 5, 3, '2024-02-04', 75.00),
    (1, 4, 8, '2024-02-05', 120.00),
    (4, 6, 1, '2024-02-06', 40.00),
    (1, 8, 5, '2024-02-07', 60.00),
    (4, 10, 4, '2024-02-08', 32.00),
    (1, 1, 5, '2024-02-01', 100.00),
    (1, 3, 10, '2024-02-02', 50.00),
    (4, 2, 2, '2024-02-03', 30.00),
    (4, 5, 3, '2024-02-04', 75.00),
    (1, 4, 8, '2024-02-05', 120.00),
    (4, 6, 1, '2024-02-06', 40.00),
    (1, 8, 5, '2024-02-07', 60.00),
    (4, 10, 4, '2024-02-08', 32.00),
    (1, 1, 5, '2024-02-01', 100.00),
    (1, 3, 10, '2024-02-02', 50.00),
    (4, 2, 2, '2024-02-03', 30.00),
    (4, 5, 3, '2024-02-04', 75.00),
    (1, 4, 8, '2024-02-05', 120.00),
    (4, 6, 1, '2024-02-06', 40.00),
    (1, 8, 5, '2024-02-07', 60.00),
    (4, 10, 4, '2024-02-08', 32.00);

INSERT INTO purchases (client_id, seller_id)
  VALUES 
    (2, 1),
    (2, 1),
    (3, 1),
    (3, 1),
    (5, 1),
    (2, 4),
    (3, 1),
    (5, 4),
    (2, 1),
    (3, 4);


INSERT INTO purchase_details (client_id, purchase_id, product_id, loaded_units)
  VALUES 
    (2, 1, 1, 3),
    (2, 2, 2, 1),
    (3, 3, 4, 1),
    (3, 4, 8, 1),
    (5, 5, 10, 1),
    (5, 5, 1, 1),
    (5, 5, 2, 1),
    (2, 6, 3, 1),
    (2, 6, 4, 1),
    (2, 6, 5, 1),
    (5, 5, 7, 1),
    (3, 7, 2, 1),
    (3, 7, 8, 1),
    (5, 8, 4, 1),
    (5, 8, 10, 1),
    (5, 8, 1, 1),
    (2, 9, 2, 1),
    (2, 9, 3, 1),
    (3, 10, 4, 1);

INSERT INTO payments (client_id, purchase_id, date, amount, currency, reference, exchange_rate, payment_method)
  VALUES 
    (2, 1, '2023-01-01', 1, 'USD', '1', 35.71, 'efectivo'),
    (2, 2, '2023-01-02', 30.00, 'USD', '12', 35.71, 'efectivo'),
    (3, 3, '2023-01-03', 74.00, 'USD', '2', 35.71, 'efectivo'),
    (5, 5, '2023-01-03', 1, 'USD', '22', 35.71, 'efectivo');

COMMIT;
