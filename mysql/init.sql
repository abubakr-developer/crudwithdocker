CREATE DATABASE IF NOT EXISTS crud2;
USE crud2;

CREATE TABLE IF NOT EXISTS users (
  user_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  country VARCHAR(100) DEFAULT NULL,
  created_at DATE DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'active',
  PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS orders (
  order_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  total DECIMAL(10,2) DEFAULT 0.00,
  PRIMARY KEY (order_id),
  KEY idx_orders_user_id (user_id),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

INSERT INTO users (name, email, country, created_at, status) VALUES
  ('Alice Johnson', 'alice@example.com', 'USA', '2024-01-01', 'active'),
  ('Bob Smith', 'bob@example.com', 'Canada', '2024-02-15', 'inactive')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  email = VALUES(email),
  country = VALUES(country),
  created_at = VALUES(created_at),
  status = VALUES(status);

INSERT INTO orders (user_id, total) VALUES
  (1, 150.00),
  (2, 220.50)
ON DUPLICATE KEY UPDATE
  total = VALUES(total);
