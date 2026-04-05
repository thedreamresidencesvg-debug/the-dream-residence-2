ALTER TABLE bookings ADD COLUMN IF NOT EXISTS confirmation_email_sent BOOLEAN DEFAULT false;
