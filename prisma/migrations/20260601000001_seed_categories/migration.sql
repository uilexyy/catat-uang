-- Seed default categories
INSERT INTO categories (name, type) VALUES
  ('Gaji', 'income'),
  ('Freelance', 'income'),
  ('Investasi', 'income'),
  ('Hadiah', 'income'),
  ('Makanan', 'expense'),
  ('Transport', 'expense'),
  ('Belanja', 'expense'),
  ('Hiburan', 'expense'),
  ('Tagihan', 'expense'),
  ('Kesehatan', 'expense'),
  ('Pendidikan', 'expense'),
  ('Lainnya', 'both')
ON CONFLICT DO NOTHING;
