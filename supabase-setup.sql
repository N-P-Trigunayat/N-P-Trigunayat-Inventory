
-- Create tables for inventory system

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(50) NOT NULL UNIQUE,
  category VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  cost_price DECIMAL(10, 2),
  stock INTEGER DEFAULT 0,
  reorder_level INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category) REFERENCES categories(name)
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'User',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  invoice_no VARCHAR(50) NOT NULL UNIQUE,
  items JSONB NOT NULL,
  total DECIMAL(10, 2),
  discount DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2),
  final_amount DECIMAL(10, 2),
  customer_name VARCHAR(255),
  customer_contact VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert seed data
INSERT INTO categories (name, description) VALUES
  ('Electronics', 'Electronic components and devices'),
  ('Mechanical', 'Mechanical parts and assemblies'),
  ('Software', 'Software and licenses'),
  ('Hardware', 'Hardware components'),
  ('Accessories', 'Accessories and add-ons');

-- Enable RLS for security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
