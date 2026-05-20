import Image from "next/image";

export default function WeddingHero() {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-rose-50 via-pink-50 to-rose-100">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl" />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 text-center px-8 py-16">
        {/* 날짜 배지 */}
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-rose-100 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
          <span className="text-xs text-rose-500 tracking-[0.2em] font-medium">
            2025. 10. 18 SAT 11:00 AM
          </span>
        </div>

        {/* 커버 이미지 */}
        <div className="relative w-56 h-72 mx-auto mb-8 rounded-3xl overflow-hidden shadow-2xl shadow-rose-200/50">
          <Image
            src="/gallery/cover.jpg"
            alt="신랑신부 커버 사진"
            fill
            className="object-cover"
            sizes="224px"
            priority
          />
          {/* 이미지가 없을 때 플레이스홀더 */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-200 to-pink-300 flex items-center justify-center">
            <span className="text-6xl">💑</span>
          </div>
          {/* 실제 이미지가 있으면 위에 덮어씌워짐 */}
        </div>

        {/* 신랑신부 이름 */}
        <div className="space-y-2 mb-6">
          <p className="text-stone-400 text-xs tracking-[0.4em] uppercase">
            We Are Getting Married
          </p>
          <h1 className="text-3xl font-semibold text-stone-700 tracking-wider">
            김민준 <span className="text-rose-400 text-2xl">♥</span> 이서연
          </h1>
          <p className="text-stone-500 text-sm tracking-widest">
            Minjun Kim &amp; Seoyeon Lee
          </p>
        </div>

        {/* 초대 문구 */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl px-6 py-5 border border-white/80 max-w-xs mx-auto">
          <p className="text-stone-600 text-sm leading-7 font-light">
            서로가 서로의 곁에 있어<br />
            더 빛나는 두 사람이<br />
            이제 하나가 되려 합니다.<br />
            <br />
            소중한 걸음으로 함께해 주시어<br />
            저희의 새 출발을<br />
            축복해 주시면 감사하겠습니다.
          </p>
        </div>
      </div>

      {/* 스크롤 유도 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <div className="w-px h-6 bg-rose-300/60" />
        <div className="w-1.5 h-1.5 bg-rose-300/60 rounded-full" />
      </div>
    </section>
  );
}
