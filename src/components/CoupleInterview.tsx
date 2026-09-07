const COUPLE = [
  {
    role: "GROOM",
    name: "김영서",
    englishName: "Youngseo Kim",
    initial: "K",
    introduction: "차분한 마음으로 오래 곁을 지키는 사람",
  },
  {
    role: "BRIDE",
    name: "정진성",
    englishName: "Jinsung Jung",
    initial: "J",
    introduction: "작은 순간에서도 기쁨을 발견하는 사람",
  },
];

const INTERVIEW = [
  {
    question: "서로의 첫인상은?",
    groom: "웃을 때 주변까지 환해지는 사람이었습니다.",
    bride: "차분하지만 따뜻한 사람이라는 생각이 들었어요.",
  },
  {
    question: "가장 사랑스러운 순간은?",
    groom: "사소한 일에도 진심으로 기뻐해 줄 때요.",
    bride: "말없이 제 편이 되어주는 모든 순간이요.",
  },
  {
    question: "함께 그리고 싶은 모습은?",
    groom: "매일의 안부를 가장 먼저 나누는 사이.",
    bride: "오래도록 서로를 웃게 해주는 다정한 부부.",
  },
];

export default function CoupleInterview() {
  return (
    <section id="section-couple" className="couple-section">
      <header className="couple-heading">
        <p className="section-title">About us</p>
        <h2>두 사람을 소개합니다</h2>
        <p>서로에게 가장 가까운 친구가 된 두 사람의 이야기</p>
      </header>

      <div className="couple-profiles">
        {COUPLE.map((person) => (
          <article key={person.role} className="couple-profile">
            <div className="couple-monogram" aria-hidden="true">
              {person.initial}
            </div>
            <p className="couple-role">{person.role}</p>
            <h3>{person.name}</h3>
            <p className="couple-english-name">{person.englishName}</p>
            <p className="couple-introduction">{person.introduction}</p>
          </article>
        ))}
      </div>

      <div className="interview-list">
        <p className="interview-label">A little interview</p>
        {INTERVIEW.map((item, index) => (
          <article key={item.question} className="interview-item">
            <p className="interview-number">0{index + 1}</p>
            <h3>{item.question}</h3>
            <dl className="interview-answers">
              <div>
                <dt>영서</dt>
                <dd>{item.groom}</dd>
              </div>
              <div>
                <dt>진성</dt>
                <dd>{item.bride}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
