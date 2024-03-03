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
CREATE TYPE type_payment_method AS ENUM ('efectivo', 'transferencia', 'tarjeta', 'pago movil', 'saldo a favor');
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
  role type_role NOT NULL,
  created_at dom_created_at,
  CONSTRAINT clients_pk PRIMARY KEY (user_id),
  CONSTRAINT clients_unique_email UNIQUE (email),
  CONSTRAINT clients_unique_card_id UNIQUE (user_card_id),
  CONSTRAINT clients_unique_phone_number UNIQUE (phone_number),
  CONSTRAINT clients_fk FOREIGN KEY (user_id)
   REFERENCES users (user_id) 
    ON UPDATE CASCADE 
    ON DELETE CASCADE
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
  serial_number dom_reference DEFAULT NULL,
  image_url dom_name DEFAULT NULL,
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
  CONSTRAINT products_unique_serial_number UNIQUE (serial_number),
  CONSTRAINT check_sale_price CHECK (sale_price > 0),-- esto funciona o intrfiere el dom_amount? que si puede ser 0
  CONSTRAINT check_available_units CHECK (available_units >= 0)
);
-- 5
CREATE TABLE purchases (
  client_id INTEGER,
  purchase_id INTEGER GENERATED ALWAYS AS IDENTITY,
  date dom_created_at NOT NULL,
  total_purchase_amount numeric(8,2) NOT NULL DEFAULT 0,
  is_paid BOOLEAN NOT NULL DEFAULT FALSE,
  seller_id INTEGER NOT NULL,
  CONSTRAINT purchases_pk PRIMARY KEY (client_id, purchase_id),
  CONSTRAINT purchases_fk FOREIGN KEY (client_id)
   REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT purchases_fk_seller FOREIGN KEY (seller_id)
   REFERENCES admins (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);
-- 6
CREATE TABLE purchase_details (
  client_id INTEGER,
  purchase_id INTEGER,
  product_id INTEGER,
  loaded_units INTEGER NOT NULL,
  charget_price dom_amount NOT NULL DEFAULT 0, -- porque el default 0?
  total_item_amount dom_amount NOT NULL GENERATED ALWAYS AS (
    charget_price * loaded_units
  ) STORED,
  CONSTRAINT purchase_details_pk PRIMARY KEY (client_id, purchase_id, product_id),
  CONSTRAINT purchase_details_fk_purchase FOREIGN KEY (client_id, purchase_id)
   REFERENCES purchases (client_id, purchase_id)
    ON UPDATE CASCADE 
    ON DELETE RESTRICT,
  CONSTRAINT purchase_details_fk_product FOREIGN KEY (product_id)
   REFERENCES products (product_id)
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);
-- 7
CREATE TABLE payments (-- sospechoso esta permitiendo null en el fk client_id
  client_id INTEGER,
  purchase_id INTEGER,
  payment_id INTEGER GENERATED ALWAYS AS IDENTITY,
  date dom_created_at,
  amount dom_amount NOT NULL,
  currency type_currency NOT NULL,
  reference dom_reference NOT NULL,-- necesito que no se repita pero que en caso de que sea efectivo no sea obligatorio o que se pueda repetir
  exchange_rate numeric(5,2) NOT NULL,
  payment_method type_payment_method NOT NULL,
  amount_in_usd dom_amount GENERATED ALWAYS AS (
    CASE
      WHEN currency = 'USD' THEN amount
      WHEN currency = 'VES' THEN amount / exchange_rate
    END
  ) STORED,
  created_at dom_created_at,
  updated_at dom_created_at,
  CONSTRAINT payments_pk PRIMARY KEY (client_id, purchase_id, payment_id),
  CONSTRAINT payments_fk FOREIGN KEY (client_id, purchase_id)
   REFERENCES purchases (client_id, purchase_id)
    ON UPDATE CASCADE 
    ON DELETE RESTRICT,
  CONSTRAINT check_amount CHECK (amount > 0),-- esto funciona o intrfiere el dom_amount? que si puede ser 0
  CONSTRAINT check_exchange_rate CHECK (exchange_rate > 0),
  CONSTRAINT uq_reference UNIQUE (reference)--esto no sirve todas son diferentes
);

-- 8

CREATE TABLE buy (
  admin_id INTEGER,
  buy_idx INTEGER GENERATED ALWAYS AS IDENTITY,
  product_id INTEGER,
  units INTEGER NOT NULL,
  date dom_created_at,
  price dom_amount NOT NULL,
  CONSTRAINT buy_pk PRIMARY KEY (admin_id, buy_idx),
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
CREATE OR REPLACE FUNCTION update_updated_at ()
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

-- function to update available_units column on products from buy table
CREATE OR REPLACE FUNCTION update_available_units_from_buy() -- tambien tengo que considerar cuando actualizo en buy
 RETURNS TRIGGER AS $$
 DECLARE
  aux_units INTEGER;
  aux_sells INTEGER;
  aux_buys INTEGER;
BEGIN
  IF TG_OP = 'DELETE' THEN
    SELECT available_units FROM products WHERE product_id = OLD.product_id INTO aux_units;
    IF aux_units < OLD.units THEN
      RAISE EXCEPTION 'No hay suficientes unidades disponibles del producto % quiza ya han sido vendidas', OLD.product_id;
    END IF;
    UPDATE products 
    SET available_units = available_units - OLD.units 
    WHERE product_id = OLD.product_id;
  ELSIF TG_OP = 'INSERT' THEN
    UPDATE products 
    SET available_units = available_units + NEW.units 
    WHERE product_id = NEW.product_id;
  ELSIF TG_OP = 'UPDATE' THEN
    SELECT sum(units) FROM buy WHERE product_id = NEW.product_id INTO aux_buys;
    SELECT sum(loaded_units) FROM purchase_details WHERE product_id = NEW.product_id INTO aux_sells;
    aux_units = aux_buys - aux_sells;
    UPDATE products 
    SET available_units = aux_units
    WHERE product_id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- function to update available_units column on products - FROM PURCHASE_DETAILS TABLE
CREATE OR REPLACE FUNCTION update_available_units_from_purchase_details()
 RETURNS TRIGGER AS $$
 DECLARE
  aux_units INTEGER;
  loaded_units_option INTEGER;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT available_units FROM products WHERE product_id = NEW.product_id INTO aux_units;
    IF aux_units < NEW.loaded_units THEN
      RAISE EXCEPTION 'No hay suficientes unidades disponibles del producto %', NEW.product_id;
    ELSIF aux_units >= NEW.loaded_units THEN
      UPDATE products
      SET available_units = available_units - NEW.loaded_units
      WHERE product_id = NEW.product_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE products
    SET available_units = available_units + OLD.loaded_units
    WHERE product_id = OLD.product_id;
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
  SET charget_price = aux_sale_price
  WHERE client_id = NEW.client_id AND purchase_id = NEW.purchase_id AND product_id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- function to update total_purchase_amount column - ON PURCHASES TABLE
CREATE OR REPLACE FUNCTION update_total_purchase_amount()
 RETURNS TRIGGER AS $$
 DECLARE
  purchase_id_option INTEGER;
  client_id_option INTEGER;
  aux_total_purchase_amount dom_amount;
BEGIN
  client_id_option = NEW.client_id;
  purchase_id_option = NEW.purchase_id;
  IF TG_OP = 'DELETE' or TG_OP = 'UPDATE' THEN
    purchase_id_option = OLD.purchase_id;
    client_id_option = OLD.client_id;
  END IF;
  
  SELECT sum(total_item_amount) 
    FROM purchase_details 
    WHERE client_id = client_id_option AND purchase_id = purchase_id_option INTO aux_total_purchase_amount;
  IF aux_total_purchase_amount IS NULL THEN
    aux_total_purchase_amount = 0;
  END IF;
  UPDATE purchases
    SET total_purchase_amount = aux_total_purchase_amount
    WHERE client_id = client_id_option AND purchase_id = purchase_id_option;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- fuction to update is_paid column on purchases table from payments table
CREATE OR REPLACE FUNCTION update_is_paid()
 RETURNS TRIGGER AS $$
 DECLARE
  aux_total_purchase_amount dom_amount;
  aux_rest numeric(8,2);
  aux_is_paid BOOLEAN DEFAULT TRUE;
  client_id_option INTEGER;
  purchase_id_option INTEGER;
BEGIN
  client_id_option = NEW.client_id;
  purchase_id_option = NEW.purchase_id;
  IF TG_OP = 'DELETE' THEN
    client_id_option = OLD.client_id;
    purchase_id_option = OLD.purchase_id;
  END IF;

  SELECT total_purchase_amount FROM purchases WHERE client_id = client_id_option AND purchase_id = purchase_id_option INTO aux_total_purchase_amount;
  IF aux_total_purchase_amount IS NULL THEN
    aux_total_purchase_amount = 0;
  END IF;
  SELECT sum(p.amount_in_usd) - aux_total_purchase_amount FROM payments p WHERE p.client_id = client_id_option AND p.purchase_id = purchase_id_option INTO aux_rest;
  IF aux_rest IS NULL THEN
    aux_rest = aux_total_purchase_amount*-1;
  END IF;
  IF aux_rest < 0 THEN
    aux_is_paid = FALSE;
  ELSIF aux_rest >= 0 THEN
    aux_is_paid = TRUE;
  END IF;
    UPDATE purchases
    SET is_paid = aux_is_paid
    WHERE client_id = client_id_option AND purchase_id = purchase_id_option;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
-- trigger to update total_purchase_amount column - ON PURCHASES TABLE
CREATE TRIGGER update_total_purchase_amount
AFTER INSERT OR DELETE OR UPDATE ON purchase_details
FOR EACH ROW
EXECUTE FUNCTION update_total_purchase_amount();

-- trigger to insert clients and admins in her respective tables - ON USERS TABLE
CREATE TRIGGER insert_client_or_admin
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION insert_client_or_admin();

-- trigger to update available_units column - ON BUY TABLE
CREATE TRIGGER update_available_units
AFTER INSERT OR DELETE OR UPDATE ON buy
FOR EACH ROW
EXECUTE FUNCTION update_available_units_from_buy();

-- trigger to update updated_at column - ON PRODUCTS TABLE
CREATE TRIGGER update_updated_at_products
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- trigger to update updated_at column - ON PAYMENTS TABLE
CREATE TRIGGER update_updated_at_payments
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- trigger to update available_units column - ON PURCHASE_DETAILS TABLE
CREATE TRIGGER update_available_units_at_products
AFTER INSERT OR DELETE ON purchase_details
FOR EACH ROW
EXECUTE FUNCTION update_available_units_from_purchase_details();

-- trigger to charge sale_price on purchase_details table
CREATE TRIGGER charge_sale_price
AFTER INSERT ON purchase_details
FOR EACH ROW
EXECUTE FUNCTION charge_sale_price();

-- trigger to update is_paid column on purchases table from payments table
CREATE TRIGGER update_is_paid
AFTER INSERT OR DELETE OR UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_is_paid();

COMMIT;