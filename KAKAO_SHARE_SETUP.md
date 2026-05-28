# 카카오톡 공유 기능 구현 가이드

이 문서는 모바일 청첩장 웹앱에 카카오톡 공유 기능을 설정하고 사용하는 방법을 설명합니다.

## 📋 목차

1. [카카오 개발자 센터 설정](#카카오-개발자-센터-설정)
2. [환경 변수 설정](#환경-변수-설정)
3. [구현 내용](#구현-내용)
4. [테스트 방법](#테스트-방법)
5. [문제 해결](#문제-해결)

---

## 카카오 개발자 센터 설정

### 1단계: 카카오 개발자 계정 생성

[카카오 개발자 센터](https://developers.kakao.com/)에 접속하여 계정을 생성합니다.

### 2단계: 애플리케이션 등록

1. **내 애플리케이션** 메뉴에서 **애플리케이션 추가하기** 클릭
2. 앱 이름 입력 (예: "우리 결혼해요")
3. **저장** 클릭

### 3단계: 플랫폼 설정

1. 생성된 앱 선택
2. **설정** → **플랫폼** 메뉴로 이동
3. **Web 플랫폼 추가** 클릭
4. 청첩장이 호스팅될 도메인 입력 (예: `https://my-wedding.com`)
5. 로컬 개발 시 `http://localhost:3000` 도 추가 가능

### 4단계: JavaScript 키 발급

1. **요약 정보** 탭에서 **앱 키** 섹션 확인
2. **JavaScript 키** 복사

---

## 환경 변수 설정

### `.env.local` 파일 수정

프로젝트 루트의 `.env.local` 파일을 열고 다음을 수정합니다:

```env
# Kakao Talk Share API
NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY=YOUR_KAKAO_JAVASCRIPT_KEY
```

`YOUR_KAKAO_JAVASCRIPT_KEY`를 카카오 개발자 센터에서 복사한 **JavaScript 키**로 교체합니다.

**⚠️ 주의사항:**
- `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
- 실제 배포 시에는 호스팅 서비스(Vercel, AWS 등)의 환경 변수 설정에서 키를 추가해야 합니다.

---

## 구현 내용

### 새로 추가된 파일

#### 1. `src/components/KakaoShare.tsx`

카카오톡 공유 기능을 담당하는 React 컴포넌트입니다.

**주요 기능:**
- Kakao SDK 자동 로드
- 공유 버튼 클릭 시 카카오톡 공유 팝업 표시
- 공유 메시지에 포함되는 정보:
  - 제목: "김민준 ♥ 이서연 결혼합니다"
  - 설명: 결혼식 날짜, 시간, 장소
  - 이미지: `/og-image.jpg`
  - 버튼 1: "모바일 청첩장" (메인 페이지로 이동)
  - 버튼 2: "위치 보기" (예식 안내 섹션으로 이동)

**Props:**
```typescript
interface KakaoShareProps {
  title?: string;              // 공유 메시지 제목
  description?: string;        // 공유 메시지 설명
  imageUrl?: string;          // 공유될 이미지 URL
  webUrl?: string;            // PC 웹 링크
  mobileWebUrl?: string;      // 모바일 웹 링크
}
```

### 수정된 파일

#### 1. `src/components/WeddingHero.tsx`

- `KakaoShare` 컴포넌트 import 추가
- 초대 문구 카드 아래에 카카오톡 공유 버튼 추가
- 스크롤 유도 영역 위치 조정

#### 2. `.env.local`

- `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY` 환경 변수 추가

---

## 테스트 방법

### 로컬 환경에서 테스트

1. **개발 서버 시작:**
   ```bash
   npm run dev
   ```

2. **브라우저에서 접속:**
   ```
   http://localhost:3000
   ```

3. **카카오톡 공유 버튼 테스트:**
   - 페이지 로드 후 카카오톡 공유 버튼이 표시되는지 확인
   - 버튼 클릭 시 카카오톡 공유 팝업이 나타나는지 확인
   - (카카오톡이 설치된 모바일 기기에서 테스트 권장)

### 배포 후 테스트

1. 배포된 도메인에서 페이지 접속
2. 카카오톡 공유 버튼 클릭
3. 카카오톡 앱에서 공유 메시지 수신 확인

---

## 문제 해결

### 공유 버튼이 작동하지 않는 경우

**1. 환경 변수 확인**
```bash
# .env.local 파일이 존재하는지 확인
ls -la .env.local

# 개발 서버 재시작
npm run dev
```

**2. 카카오 개발자 센터 설정 확인**
- 등록된 도메인이 현재 접속 중인 도메인과 일치하는지 확인
- 로컬 테스트 시 `http://localhost:3000` 도메인이 등록되어 있는지 확인

**3. 브라우저 콘솔 확인**
- F12 개발자 도구 → Console 탭에서 에러 메시지 확인
- SDK 로드 실패 메시지가 있으면 네트워크 상태 확인

### 공유 메시지가 이상하게 표시되는 경우

**1. 이미지 URL 확인**
- `/og-image.jpg` 파일이 `public` 폴더에 존재하는지 확인
- 이미지 파일이 없으면 다른 이미지로 교체

**2. 메타 태그 설정**
`src/app/layout.tsx`의 Open Graph 메타 태그가 올바르게 설정되어 있는지 확인:
```typescript
openGraph: {
  title: "김민준 ♥ 이서연 결혼합니다",
  description: "2025년 10월 18일 토요일 오전 11시",
  type: "website",
},
```

---

## 추가 커스터마이징

### 공유 메시지 내용 변경

`src/components/KakaoShare.tsx` 파일의 Props 기본값을 수정합니다:

```typescript
export default function KakaoShare({
  title = "원하는 제목",  // 변경
  description = "원하는 설명",  // 변경
  imageUrl = "/your-image.jpg",  // 변경
  // ...
}: KakaoShareProps) {
```

### 공유 버튼 스타일 변경

`src/components/KakaoShare.tsx`의 `button` 요소의 `style` 속성을 수정합니다.

### 다른 페이지에서 공유 기능 추가

다른 컴포넌트에서도 `KakaoShare` 컴포넌트를 import하여 사용할 수 있습니다:

```typescript
import KakaoShare from "@/components/KakaoShare";

export default function MyComponent() {
  return (
    <div>
      <KakaoShare 
        title="커스텀 제목"
        description="커스텀 설명"
      />
    </div>
  );
}
```

---

## 참고 자료

- [카카오 개발자 센터](https://developers.kakao.com/)
- [카카오톡 공유 API 문서](https://developers.kakao.com/docs/ko/kakaotalk-share/js-link)
- [메시지 템플릿 가이드](https://developers.kakao.com/docs/ko/message-template/common)

---

**마지막 업데이트:** 2025년 1월
**작성자:** Manus AI
