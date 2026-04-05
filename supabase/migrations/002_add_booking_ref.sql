-- Add booking reference column
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_ref TEXT UNIQUE;

-- Generate booking refs for existing bookings
UPDATE bookings
SET booking_ref = 'DR-' || UPPER(SUBSTRING(id::text, 1, 8))
WHERE booking_ref IS NULL;

-- Make it not null with a default for future rows
ALTER TABLE bookings ALTER COLUMN booking_ref SET DEFAULT 'DR-' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8));
