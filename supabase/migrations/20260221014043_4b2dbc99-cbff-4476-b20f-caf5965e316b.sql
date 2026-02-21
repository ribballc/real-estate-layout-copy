-- Add column to persist the selected QR code URL per user
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS qr_code_url text DEFAULT NULL;