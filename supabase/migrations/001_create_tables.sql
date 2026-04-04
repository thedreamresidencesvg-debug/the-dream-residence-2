-- Booking tiers
CREATE TABLE tiers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price_per_night INTEGER NOT NULL,
    max_guests INTEGER NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed tiers
INSERT INTO tiers (id, name, description, price_per_night, max_guests, bedrooms, bathrooms) VALUES
('private-suite', 'Private Suite', 'Private 1-bedroom suite with living room, kitchen, and en-suite bathroom', 20000, 2, 1, 1),
('full-house', 'Full House', 'Entire property with 3 bedrooms, full kitchen, and 2 bathrooms', 30000, 6, 3, 2),
('shared-space', 'Shared Space', 'Private lockable bedroom with shared kitchen and living room', 15000, 2, 1, 1);

-- Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_id TEXT NOT NULL REFERENCES tiers(id),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    nights INTEGER GENERATED ALWAYS AS (check_out - check_in) STORED,
    total_price INTEGER NOT NULL,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT,
    guest_count INTEGER NOT NULL DEFAULT 1,
    special_requests TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    stripe_session_id TEXT,
    stripe_payment_intent TEXT,
    payment_status TEXT DEFAULT 'unpaid',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (check_out > check_in),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    CONSTRAINT valid_payment CHECK (payment_status IN ('unpaid', 'paid', 'refunded'))
);

-- Blocked dates
CREATE TABLE blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_id TEXT REFERENCES tiers(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_block_dates CHECK (end_date > start_date)
);

-- Contact inquiries
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bookings_dates ON bookings (check_in, check_out) WHERE status != 'cancelled';
CREATE INDEX idx_bookings_tier ON bookings (tier_id, check_in) WHERE status != 'cancelled';
CREATE INDEX idx_blocked_dates_range ON blocked_dates (start_date, end_date);

-- Availability check function
CREATE OR REPLACE FUNCTION check_availability(
    p_tier_id TEXT,
    p_check_in DATE,
    p_check_out DATE
) RETURNS BOOLEAN AS $$
DECLARE
    v_conflict_count INTEGER;
    v_guest_count INTEGER;
BEGIN
    -- Check blocked dates
    SELECT COUNT(*) INTO v_conflict_count
    FROM blocked_dates
    WHERE (tier_id IS NULL OR tier_id = p_tier_id)
      AND start_date < p_check_out AND end_date > p_check_in;
    IF v_conflict_count > 0 THEN RETURN FALSE; END IF;

    -- Full House: no other bookings can exist
    IF p_tier_id = 'full-house' THEN
        SELECT COUNT(*) INTO v_conflict_count FROM bookings
        WHERE status IN ('confirmed', 'pending')
          AND check_in < p_check_out AND check_out > p_check_in;
        RETURN v_conflict_count = 0;
    END IF;

    -- Check if full-house is booked
    SELECT COUNT(*) INTO v_conflict_count FROM bookings
    WHERE tier_id = 'full-house' AND status IN ('confirmed', 'pending')
      AND check_in < p_check_out AND check_out > p_check_in;
    IF v_conflict_count > 0 THEN RETURN FALSE; END IF;

    -- Private Suite: max 1
    IF p_tier_id = 'private-suite' THEN
        SELECT COUNT(*) INTO v_conflict_count FROM bookings
        WHERE tier_id = 'private-suite' AND status IN ('confirmed', 'pending')
          AND check_in < p_check_out AND check_out > p_check_in;
        RETURN v_conflict_count = 0;
    END IF;

    -- Shared Space: max 6 guests total
    IF p_tier_id = 'shared-space' THEN
        SELECT COALESCE(SUM(guest_count), 0) INTO v_guest_count FROM bookings
        WHERE tier_id = 'shared-space' AND status IN ('confirmed', 'pending')
          AND check_in < p_check_out AND check_out > p_check_in;
        RETURN v_guest_count < 6;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tiers viewable by everyone" ON tiers FOR SELECT USING (true);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create booking" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view bookings" ON bookings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can update bookings" ON bookings FOR UPDATE USING (auth.role() = 'authenticated');

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit inquiry" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view inquiries" ON inquiries FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view blocked dates" ON blocked_dates FOR SELECT USING (true);
CREATE POLICY "Admin manages blocked dates" ON blocked_dates FOR ALL USING (auth.role() = 'authenticated');
