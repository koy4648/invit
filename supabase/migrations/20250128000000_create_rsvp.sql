-- RSVP 테이블 생성
CREATE TABLE IF NOT EXISTS public.rsvp (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    attendance TEXT NOT NULL, -- 'attend' | 'absent'
    guest_count INTEGER DEFAULT 1,
    meal_preference TEXT, -- 'yes' | 'no' | 'undecided'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) 설정
ALTER TABLE public.rsvp ENABLE ROW LEVEL SECURITY;

-- 누구나 RSVP를 추가할 수 있도록 허용
CREATE POLICY "Allow anonymous insert to rsvp" ON public.rsvp
    FOR INSERT WITH CHECK (true);

-- 관리자만 RSVP를 볼 수 있도록 허용 (여기서는 단순화를 위해 익명 읽기도 허용하거나, 추후 관리자 기능을 위해 설정)
CREATE POLICY "Allow anonymous read for admin purposes" ON public.rsvp
    FOR SELECT USING (true);
