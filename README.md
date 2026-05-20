# 💍 모바일 청첩장

Next.js App Router + Supabase + Cloudflare R2 기반의 풀스택 모바일 청첩장입니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend / Backend | Next.js 16 (App Router) |
| 스타일링 | Tailwind CSS v4 |
| 방명록 DB | Supabase (PostgreSQL) |
| 사진 스토리지 | Cloudflare R2 (S3 호환) |
| 배포 | Vercel |

## 주요 기능

- **D-Day 카운트다운**: 예식 일시까지 일/시간/분/초 실시간 타이머
- **갤러리**: 터치 슬라이드 캐러셀 ↔ 그리드 전환, 라이트박스 뷰어
- **방명록**: Supabase 연동 실시간 메시지 등록/조회
- **하객 사진 공유**: Cloudflare R2 Presigned URL 직접 업로드, 다중 파일, 진행률 표시

## 빠른 시작

### 1. 저장소 클론

```bash
git clone https://github.com/koy4648/invitation.git
cd invitation
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열고 아래 값들을 채워주세요.

#### Supabase 설정

1. [Supabase 대시보드](https://supabase.com/dashboard) → 프로젝트 생성
2. Settings → API → `URL`과 `anon key` 복사
3. SQL Editor에서 `supabase/migrations/001_create_guestbook.sql` 실행

#### Cloudflare R2 설정

1. [Cloudflare 대시보드](https://dash.cloudflare.com) → R2 → 버킷 생성
2. R2 → Manage R2 API Tokens → API 토큰 생성 (Object Read & Write)
3. 버킷 Settings → CORS Policy 설정 (아래 참조)
4. 버킷 Settings → Public Access → 퍼블릭 URL 활성화 (선택)

**R2 CORS 설정 예시:**

```json
[
  {
    "AllowedOrigins": [
      "https://your-app.vercel.app",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["Content-Type", "Content-Length"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

### 3. 갤러리 이미지 추가

`public/gallery/` 폴더에 다음 파일들을 추가하세요:

```
public/
  gallery/
    cover.jpg      ← 메인 커버 사진
    photo1.jpg     ← 갤러리 사진 1
    photo2.jpg     ← 갤러리 사진 2
    photo3.jpg     ← 갤러리 사진 3
    photo4.jpg     ← 갤러리 사진 4
    photo5.jpg     ← 갤러리 사진 5
    photo6.jpg     ← 갤러리 사진 6
```

이미지 파일명/경로는 `src/components/Gallery.tsx`의 `GALLERY_IMAGES` 배열에서 수정할 수 있습니다.

### 4. 개인 정보 수정

다음 파일들에서 신랑신부 정보를 수정하세요:

| 파일 | 수정 내용 |
|------|-----------|
| `src/app/layout.tsx` | 메타데이터 (제목, 설명) |
| `src/components/WeddingHero.tsx` | 신랑신부 이름, 예식 날짜 |
| `src/components/WeddingInfo.tsx` | 예식장 정보, 연락처 |
| `src/components/CountdownTimer.tsx` | `WEDDING_DATE` 상수 |

### 5. 로컬 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인하세요.

## Vercel 배포

1. [Vercel](https://vercel.com)에 GitHub 저장소 연결
2. Environment Variables에 `.env.local`의 모든 값 입력
3. Deploy 클릭

> **주의**: `SUPABASE_SERVICE_ROLE_KEY`와 `R2_SECRET_ACCESS_KEY`는 절대 클라이언트에 노출되지 않도록 `NEXT_PUBLIC_` 접두사 없이 설정하세요.

## 아키텍처

```
클라이언트 (브라우저)
    │
    ├─ 방명록 읽기/쓰기 ──────────────────→ Supabase (PostgreSQL)
    │   (supabase-js 직접 호출)
    │
    └─ 사진 업로드 플로우:
        1. POST /api/upload-url ──────────→ Next.js API Route
        │   (파일명, MIME 타입 전송)            │
        │                                    └─ AWS SDK로 R2 Presigned URL 발급
        │
        2. ← Presigned URL 수신
        │
        3. PUT {presignedUrl} ────────────→ Cloudflare R2
            (파일 직접 스트리밍 업로드)         (Vercel 서버 미경유)
```

## 환경 변수 목록

| 변수명 | 설명 | 공개 여부 |
|--------|------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 공개 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon 키 | 공개 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role 키 | **비공개** |
| `R2_ACCOUNT_ID` | Cloudflare 계정 ID | **비공개** |
| `R2_ACCESS_KEY_ID` | R2 Access Key ID | **비공개** |
| `R2_SECRET_ACCESS_KEY` | R2 Secret Access Key | **비공개** |
| `R2_BUCKET_NAME` | R2 버킷 이름 | **비공개** |
| `R2_PUBLIC_URL` | R2 퍼블릭 접근 URL | **비공개** |

## 라이선스

MIT
