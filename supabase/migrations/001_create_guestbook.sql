-- =============================================================================
-- 방명록 테이블 생성 마이그레이션
-- Supabase SQL Editor에서 실행하거나 supabase db push 명령어로 적용하세요.
-- =============================================================================

-- 방명록 테이블
CREATE TABLE IF NOT EXISTS public.guestbook (
  id          UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name        VARCHAR(20)  NOT NULL CHECK (char_length(trim(name)) >= 1),
  password    VARCHAR(100) NOT NULL CHECK (char_length(trim(password)) >= 4),
  message     TEXT         NOT NULL CHECK (
                             char_length(trim(message)) >= 1
                             AND char_length(message) <= 200
                           ),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 테이블 코멘트
COMMENT ON TABLE public.guestbook IS '결혼식 하객 방명록';
COMMENT ON COLUMN public.guestbook.id IS '고유 식별자 (UUID v4)';
COMMENT ON COLUMN public.guestbook.name IS '작성자 이름 (최대 20자)';
COMMENT ON COLUMN public.guestbook.password IS '수정/삭제용 비밀번호 (최소 4자)';
COMMENT ON COLUMN public.guestbook.message IS '축하 메시지 (최대 200자)';
COMMENT ON COLUMN public.guestbook.created_at IS '작성 일시 (UTC)';

-- 최신순 정렬을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at
  ON public.guestbook (created_at DESC);

-- =============================================================================
-- Row Level Security (RLS) 설정
-- =============================================================================

-- RLS 활성화
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능 (SELECT)
CREATE POLICY "guestbook_select_all"
  ON public.guestbook
  FOR SELECT
  USING (true);

-- 모든 사용자가 쓰기 가능 (INSERT) - 청첩장 특성상 인증 없이 허용
CREATE POLICY "guestbook_insert_all"
  ON public.guestbook
  FOR INSERT
  WITH CHECK (true);

-- 삭제는 Service Role Key를 통해서만 가능 (관리자 전용)
-- DELETE 정책은 별도로 추가하지 않아 기본 차단 상태 유지
