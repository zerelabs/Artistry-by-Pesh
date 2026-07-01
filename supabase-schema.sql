-- ==========================================
-- SUPABASE SCHEMA FOR BOOKINGS & PAYMENTS
-- ==========================================

-- 1. WORKSHOPS
CREATE TABLE public.workshops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    overline TEXT,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    total_seats INTEGER NOT NULL,
    available_seats INTEGER NOT NULL,
    image_url TEXT,
    accent_color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



-- Note: In a real scenario, you'd insert your workshop data here.

-- 2. CUSTOMERS
CREATE TABLE public.customers (
    id UUID PRIMARY KEY REFERENCES auth.users(id), -- Linked to Supabase Auth
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BOOKINGS
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id), -- For authenticated users
    guest_name TEXT,
    guest_email TEXT,
    guest_phone TEXT,
    workshop_id UUID REFERENCES public.workshops(id),
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'confirmed' | 'failed'
    amount_paid DECIMAL(10,2) NOT NULL,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. COUPONS
CREATE TABLE public.coupons (
    code TEXT PRIMARY KEY,
    discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
    valid_until TIMESTAMP WITH TIME ZONE,
    usage_limit INTEGER,
    times_used INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLICIES
-- ==========================================

-- 1. WORKSHOPS
-- Public can read
CREATE POLICY "Public workshops are viewable by everyone" ON public.workshops FOR SELECT USING (true);
-- Admin can manage
CREATE POLICY "Admin can insert workshops" ON public.workshops FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update workshops" ON public.workshops FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete workshops" ON public.workshops FOR DELETE USING (auth.role() = 'authenticated');

-- 2. CUSTOMERS
-- Admin can manage
CREATE POLICY "Admin can select customers" ON public.customers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can update customers" ON public.customers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete customers" ON public.customers FOR DELETE USING (auth.role() = 'authenticated');
-- Self can manage
CREATE POLICY "Users can view own profile" ON public.customers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.customers FOR UPDATE USING (auth.uid() = id);

-- 3. BOOKINGS
-- Public can insert (Guest checkout)
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
-- Admin can manage
CREATE POLICY "Admin can view bookings" ON public.bookings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can update bookings" ON public.bookings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete bookings" ON public.bookings FOR DELETE USING (auth.role() = 'authenticated');
-- Self can view
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = customer_id);

-- 4. COUPONS
-- Public can read (for checkout validation)
CREATE POLICY "Public can view coupons" ON public.coupons FOR SELECT USING (true);
-- Admin can manage
CREATE POLICY "Admin can insert coupons" ON public.coupons FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update coupons" ON public.coupons FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete coupons" ON public.coupons FOR DELETE USING (auth.role() = 'authenticated');

-- ==========================================
-- FUNCTIONS
-- ==========================================
-- Stored Procedure to decrement seats safely (prevents race conditions)
CREATE OR REPLACE FUNCTION decrement_seats(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.workshops
  SET available_seats = available_seats - 1
  WHERE id = row_id AND available_seats > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
