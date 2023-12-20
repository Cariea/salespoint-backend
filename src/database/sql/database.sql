-- Pendientes:
-- - crear regex para validar campos como email, telefono, cedula, etc
BEGIN;
-- Domains and Types
CREATE DOMAIN dom_name VARCHAR(64);
CREATE DOMAIN dom_cards_id VARCHAR(16);
CREATE DOMAIN dom_residence_address VARCHAR(128);
CREATE DOMAIN dom_phone_number VARCHAR(16);
CREATE DOMAIN dom_email VARCHAR(64);
CREATE DOMAIN dom_password VARCHAR(64);
CREATE DOMAIN dom_reference VARCHAR(64);
CREATE DOMAIN dom_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
CREATE DOMAIN dom_amount numeric(8,2) CHECK (VALUE >= 0);
CREATE DOMAIN dom_volume numeric(6,2) CHECK (VALUE > 0);

CREATE TYPE type_role AS ENUM ('admin', 'client');
CREATE TYPE type_currency AS ENUM ('USD', 'VES');
CREATE TYPE type_payment_method AS ENUM ('efectivo', 'transferencia', 'tarjeta', 'pago movil');
CREATE TYPE type_unit_measure AS ENUM ('kg', 'g', 'l', 'ml', 'unidades');

-- Tables

-- 1
CREATE TABLE users (
  user_id INTEGER GENERATED ALWAYS AS IDENTITY,
  user_card_id dom_cards_id DEFAULT NULL,
  name dom_name NOT NULL,
  email dom_email,
  password dom_password,
  role type_role NOT NULL,
  created_at dom_created_at,
  CONSTRAINT users_pk PRIMARY KEY (user_id),
  CONSTRAINT users_unique_email UNIQUE (email),
  CONSTRAINT users_unique_card_id UNIQUE (user_card_id),
  CONSTRAINT check_admin_email 
    CHECK ((role = 'admin' AND email IS NOT NULL) OR role = 'client'),
  CONSTRAINT check_admin_password 
    CHECK ((role = 'admin' AND password IS NOT NULL) OR role = 'client')
);
-- 2
CREATE TABLE clients (
  user_id INTEGER NOT NULL,
  user_card_id dom_cards_id DEFAULT NULL,
  name dom_name NOT NULL,
  residence_address dom_residence_address DEFAULT NULL,
  phone_number dom_phone_number DEFAULT NULL,
  email dom_email,
  password dom_password,
  role type_role NOT NULL,
  created_at dom_created_at,
  CONSTRAINT clients_pk PRIMARY KEY (user_id),
  CONSTRAINT clients_unique_email UNIQUE (email),
  CONSTRAINT clients_unique_card_id UNIQUE (user_card_id),
  CONSTRAINT clients_unique_phone_number UNIQUE (phone_number),
  CONSTRAINT clients_fk FOREIGN KEY (user_id)
   REFERENCES users (user_id) 
    ON UPDATE CASCADE 
    ON DELETE RESTRICT
);
-- 3
CREATE TABLE admins (
  user_id INTEGER NOT NULL,
  user_card_id dom_cards_id DEFAULT NULL,
  name dom_name NOT NULL,
  email dom_email,
  password dom_password NOT NULL,
  role type_role NOT NULL,
  created_at dom_created_at,
  CONSTRAINT admins_pk PRIMARY KEY (user_id),
  CONSTRAINT admins_unique_email UNIQUE (email),
  CONSTRAINT admins_unique_card_id UNIQUE (user_card_id),
  CONSTRAINT admins_fk FOREIGN KEY (user_id)
   REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);
-- 4
CREATE TABLE products (
  product_id INTEGER GENERATED ALWAYS AS IDENTITY,
  name dom_name NOT NULL,
  unit_measure type_unit_measure NOT NULL,
  volume dom_volume NOT NULL,
  sale_price dom_amount NOT NULL,
  brand dom_name NOT NULL,
  available_units INTEGER NOT NULL DEFAULT 0,
  created_at dom_created_at,
  updated_at dom_created_at,
  CONSTRAINT products_pk PRIMARY KEY (product_id),
  CONSTRAINT products_unique_name UNIQUE (name),
  CONSTRAINT check_available_units CHECK (available_units >= 0)
);
-- 5
CREATE TABLE payments (
  payment_id INTEGER GENERATED ALWAYS AS IDENTITY,
  date dom_created_at,
  amount dom_amount NOT NULL,
  currency type_currency NOT NULL,
  reference dom_reference NOT NULL,
  exchange_rate numeric(5,2) NOT NULL,
  payment_method type_payment_method NOT NULL,
  amount_in_usd dom_amount GENERATED ALWAYS AS (
    CASE
      WHEN currency = 'USD' THEN amount
      WHEN currency = 'VES' THEN amount / exchange_rate
    END
  ) STORED,
  created_at dom_created_at,
  CONSTRAINT payments_pk PRIMARY KEY (payment_id),
  CONSTRAINT check_amount CHECK (amount > 0),
  CONSTRAINT check_exchange_rate CHECK (exchange_rate > 0)
);

-- 6
CREATE TABLE purchases (
  client_id INTEGER,
  purchase_id INTEGER GENERATED ALWAYS AS IDENTITY,
  date dom_created_at NOT NULL,
  total_purchase_amount dom_amount NOT NULL DEFAULT 0,
  its_paid BOOLEAN NOT NULL DEFAULT FALSE,
  seller_id INTEGER NOT NULL,
  CONSTRAINT purchases_pk PRIMARY KEY (client_id, purchase_id),
  CONSTRAINT purchases_fk FOREIGN KEY (client_id)
   REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT purchases_fk_seller FOREIGN KEY (seller_id)
   REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);
-- 7
CREATE TABLE purchase_details (
  client_id INTEGER,
  purchase_id INTEGER,
  product_id INTEGER,
  loaded_units INTEGER NOT NULL,
  charget_price dom_amount NOT NULL DEFAULT 0,
  total_item_amount dom_amount NOT NULL DEFAULT 0,
  CONSTRAINT purchase_details_pk PRIMARY KEY (client_id, purchase_id, product_id),
  CONSTRAINT purchase_details_fk_purchase FOREIGN KEY (client_id, purchase_id)
   REFERENCES purchases (client_id, purchase_id)
    ON UPDATE CASCADE 
    ON DELETE RESTRICT,
  CONSTRAINT purchase_details_fk_product FOREIGN KEY (product_id)
   REFERENCES products (product_id)
    ON UPDATE CASCADE 
    ON DELETE RESTRICT
);
-- 8
CREATE TABLE correspond (
  payment_id INTEGER,
  client_id INTEGER,
  purchase_id INTEGER,
  amount_paid dom_amount NOT NULL DEFAULT 0,
  CONSTRAINT correspond_pk PRIMARY KEY (payment_id, client_id, purchase_id),
  CONSTRAINT correspond_fk_payment FOREIGN KEY (payment_id)
   REFERENCES payments (payment_id)
    ON UPDATE CASCADE 
    ON DELETE RESTRICT,
  CONSTRAINT correspond_fk_purchase FOREIGN KEY (client_id, purchase_id)
   REFERENCES purchases (client_id, purchase_id)
    ON UPDATE CASCADE 
    ON DELETE RESTRICT
);
-- 9
CREATE TABLE buy (
  admin_id INTEGER,
  product_id INTEGER,
  buy_idx INTEGER GENERATED ALWAYS AS IDENTITY,
  units INTEGER NOT NULL,
  date dom_created_at,
  price dom_amount NOT NULL,
  CONSTRAINT buy_pk PRIMARY KEY (admin_id, product_id, buy_idx),
  CONSTRAINT buy_fk_admin FOREIGN KEY (admin_id)
   REFERENCES admins (user_id)
    ON UPDATE CASCADE 
    ON DELETE RESTRICT,
  CONSTRAINT buy_fk_product FOREIGN KEY (product_id)
   REFERENCES products (product_id)
    ON UPDATE CASCADE 
    ON DELETE RESTRICT
);

-- Functions

-- function to update updated_at column
CREATE FUNCTION update_updated_at ()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- function to insert clients and admins in her respective tables
CREATE OR REPLACE FUNCTION insert_client_or_admin()
 RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'client' THEN
    INSERT INTO clients (user_id, user_card_id, name, email, role, created_at)
    VALUES (NEW.user_id, NEW.user_card_id, NEW.name, NEW.email, NEW.role, NEW.created_at);
  ELSIF NEW.role = 'admin' THEN
    INSERT INTO admins (user_id, user_card_id, name, email, password, role, created_at)
    VALUES (NEW.user_id, NEW.user_card_id, NEW.name, NEW.email, NEW.password, NEW.role, NEW.created_at);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- function to update available_units column
CREATE OR REPLACE FUNCTION update_available_units()
 RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET available_units = available_units + NEW.units
  WHERE product_id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- function to update available_units column - ON PURCHASE_DETAILS TABLE
CREATE OR REPLACE FUNCTION update_available_units_at_products()
 RETURNS TRIGGER AS $$
 DECLARE
  aux_units INTEGER;
BEGIN
  SELECT available_units FROM products WHERE product_id = NEW.product_id INTO aux_units;
  IF aux_units < NEW.loaded_units THEN
    RAISE EXCEPTION 'No hay suficientes unidades disponibles del producto %', NEW.product_id;
  ELSIF aux_units >= NEW.loaded_units THEN
    UPDATE products
    SET available_units = available_units - NEW.loaded_units
    WHERE product_id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- function to charge sale_price on purchase_details table
CREATE OR REPLACE FUNCTION charge_sale_price()
 RETURNS TRIGGER AS $$
 DECLARE
  aux_sale_price dom_amount;
BEGIN
  SELECT sale_price FROM products WHERE product_id = NEW.product_id INTO aux_sale_price;
  UPDATE purchase_details
  SET charget_price = aux_sale_price, total_item_amount = aux_sale_price * NEW.loaded_units
  WHERE client_id = NEW.client_id AND purchase_id = NEW.purchase_id AND product_id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- function to calculate rest of payment
CREATE OR REPLACE FUNCTION calculate_rest_of_payment(par_client_id INTEGER, par_purchase_id INTEGER)
 RETURNS dom_amount AS $$
 DECLARE
  rest_of_payment dom_amount;
BEGIN
  SELECT  p.amount_in_usd - sum(c.amount_paid) as rest FROM payments p INNER JOIN correspond c ON p.payment_id = c.payment_id WHERE c.client_id = par_client_id AND c.purchase_id = par_purchase_id  GROUP BY(p.amount_in_usd ) INTO rest_of_payment;
  RETURN rest_of_payment;
END;
$$ LANGUAGE plpgsql;

-- function to calculate total paid purchase
CREATE OR REPLACE FUNCTION calculate_total_paid_purchase(par_client_id INTEGER, par_purchase_id INTEGER)
 RETURNS dom_amount AS $$
 DECLARE
  total_purchase_paid dom_amount;
BEGIN
  SELECT SUM(amount_paid) FROM correspond WHERE client_id = par_client_id AND purchase_id = par_purchase_id INTO total_purchase_paid;
  RETURN total_purchase_paid;
END;
$$ LANGUAGE plpgsql;

-- function to calculate total debt purchase per item
CREATE OR REPLACE FUNCTION calculate_total_debt_purchase(par_client_id INTEGER, par_purchase_id INTEGER)
 RETURNS dom_amount AS $$
 DECLARE
  aux_total_purchase_amount dom_amount;
BEGIN
  SELECT total_purchase_amount FROM purchases WHERE client_id = par_client_id AND purchase_id = par_purchase_id INTO aux_total_purchase_amount;
  RETURN aux_total_purchase_amount;
END;
$$ LANGUAGE plpgsql;

-- function to update amount_paid column - ON CORRESPOND TABLE
CREATE OR REPLACE FUNCTION update_amount_paid_on_correspond()
 RETURNS TRIGGER AS $$
 DECLARE
 rest_of_payment dom_amount;
 total_purchase_amount dom_amount;
 total_purchase_paid dom_amount;
BEGIN
  rest_of_payment = calculate_rest_of_payment(NEW.client_id, NEW.purchase_id);
  total_purchase_amount = calculate_total_debt_purchase(NEW.client_id, NEW.purchase_id);
  total_purchase_paid = calculate_total_paid_purchase(NEW.client_id, NEW.purchase_id);

  IF rest_of_payment = 0 THEN
    RAISE EXCEPTION 'No queda saldo disponible del pago %', NEW.payment_id;
  END IF;
  
  IF (total_purchase_paid < total_purchase_amount) and (rest_of_payment > (total_purchase_amount - total_purchase_paid)) THEN
    UPDATE correspond
    SET amount_paid = amount_paid + (total_purchase_amount - total_purchase_paid)
    WHERE client_id = NEW.client_id AND purchase_id = NEW.purchase_id AND payment_id = NEW.payment_id;
  END IF;

IF rest_of_payment <= (total_purchase_amount - total_purchase_paid) THEN
    UPDATE correspond
    SET amount_paid = amount_paid + rest_of_payment
    WHERE client_id = NEW.client_id AND purchase_id = NEW.purchase_id AND payment_id = NEW.payment_id;
END IF;

 total_purchase_paid = calculate_total_paid_purchase(NEW.client_id, NEW.purchase_id);
 
  IF total_purchase_paid = total_purchase_amount THEN
    UPDATE purchases
    SET its_paid = TRUE
    WHERE client_id = NEW.client_id AND purchase_id = NEW.purchase_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- function to update total_purchase_amount column - ON PURCHASES TABLE
CREATE OR REPLACE FUNCTION update_total_purchase_amount()
 RETURNS TRIGGER AS $$
 DECLARE
  aux_total_purchase_amount dom_amount;
BEGIN
  SELECT sum(total_item_amount) 
    FROM purchase_details 
    WHERE client_id = NEW.client_id AND purchase_id = NEW.purchase_id INTO aux_total_purchase_amount;
  UPDATE purchases
    SET total_purchase_amount = aux_total_purchase_amount
    WHERE client_id = NEW.client_id AND purchase_id = NEW.purchase_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Triggers
-- trigger to update total_purchase_amount column - ON PURCHASES TABLE
CREATE TRIGGER update_total_purchase_amount
AFTER INSERT ON purchase_details
FOR EACH ROW
EXECUTE FUNCTION update_total_purchase_amount();

-- trigger to insert clients and admins in her respective tables - ON USERS TABLE
CREATE TRIGGER insert_client_or_admin
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION insert_client_or_admin();

-- trigger to update available_units column - ON BUY TABLE
CREATE TRIGGER update_available_units
AFTER INSERT ON buy
FOR EACH ROW
EXECUTE FUNCTION update_available_units();

-- trigger to update updated_at column - ON PRODUCTS TABLE
CREATE TRIGGER update_updated_at_products
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- trigger to update available_units column - ON PURCHASE_DETAILS TABLE
CREATE TRIGGER update_available_units_at_purchase_details
AFTER INSERT ON purchase_details
FOR EACH ROW
EXECUTE FUNCTION update_available_units_at_products();

-- trigger to charge sale_price on purchase_details table
CREATE TRIGGER charge_sale_price
AFTER INSERT ON purchase_details
FOR EACH ROW
EXECUTE FUNCTION charge_sale_price();

-- trigger to updadte amount_paid column - ON CORRESPOND TABLE
CREATE OR REPLACE TRIGGER update_amount_paid_on_correspond
AFTER INSERT ON correspond
FOR EACH ROW
EXECUTE FUNCTION update_amount_paid_on_correspond();
COMMIT;