-- Initial database setup
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data
INSERT INTO users (name, email) VALUES
  ('Alice Dev',   'alice@example.com'),
  ('Bob Ops',     'bob@example.com'),
  ('Carol Cloud', 'carol@example.com')
ON CONFLICT DO NOTHING;
