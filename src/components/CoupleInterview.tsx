"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const COUPLE = [
  {
    role: "ONE",
    name: "김영서",
    englishName: "Youngseo Kim",
    initial: "Y",
    introduction: "좋아하는 것에는 누구보다 진심인 사람. 음악과 야구, 새로운 즐거움을 사랑하고 웃음과 이야기로 하루를 채웁니다."
  },
  {
    role: "TWO",
    name: "정진성",
    englishName: "Jinseong Jeong",
    initial: "J",
    introduction: "꾸준함으로 마음을 보여주는 사람. 운동과 책, 깊은 이야기를 좋아하고 말보다 행동으로 묵묵히 곁을 지킵니다.",
  },
];

const INTERVIEW = [
  {
    question: "서로의 첫인상은?",
    bride: "성실하고 다정다감한 귀여운 구석이 있는 사람",
    groom: "웃을 때 주변까지 환해지는 사람이었습니다.",
  },
  {
    question: "가장 사랑스러운 순간은?",
    bride: "사소한 말장난을 하고 개구지게 웃을 때",
    groom: "사소한 일에도 진심으로 기뻐해 줄 때",
  },
  {
    question: "함께 그리고 싶은 모습은?",
    bride: "서로의 가장 기쁜 순간도 슬픈 순간도 함께 나누는 사이",
    groom: "오래도록 서로를 웃게 해주는 다정한 부부.",
  },
];

export default function CoupleInterview() {
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);

  return (
    <section id="section-couple" className="couple-section">
      <header className="couple-heading">
        <p className="section-title">두 사람</p>
        <h2>두 사람을 소개합니다</h2>
        <p>서로에게 가장 든든한 편이 되어주기로 한 두 사람의 이야기</p>
      </header>

      <div className="couple-profiles">
        {COUPLE.map((person) => (
          <article key={person.role} className="couple-profile">
            <div className="couple-monogram" aria-hidden="true">{person.initial}</div>
            <p className="couple-role">{person.role}</p>
            <h3>{person.name}</h3>
            <p className="couple-english-name">{person.englishName}</p>
            <p className="couple-introduction">{person.introduction}</p>
          </article>
        ))}
      </div>

      <div className="interview-list">
        <button
          type="button"
          className="interview-toggle"
          onClick={() => setIsInterviewOpen((open) => !open)}
          aria-expanded={isInterviewOpen}
          aria-controls="couple-interview-answers"
        >
          <span>
            <span className="interview-label">작은 인터뷰</span>
            <strong>{isInterviewOpen ? "우리의 이야기를 접어둘게요" : "서로에게 물어본 작은 질문들"}</strong>
          </span>
          <ChevronDown size={19} className={isInterviewOpen ? "is-open" : ""} />
        </button>

        {isInterviewOpen && (
          <div id="couple-interview-answers" className="interview-answers-panel">
            {INTERVIEW.map((item, index) => (
              <article key={item.question} className="interview-item">
                <p className="interview-number">0{index + 1}</p>
                <h3>{item.question}</h3>
                <dl className="interview-answers">
                  <div><dt>영서</dt><dd>{item.bride}</dd></div>
                  <div><dt>진성</dt><dd>{item.groom}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
