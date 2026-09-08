"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useGalleryPhotos } from "@/hooks/useGalleryPhotos";

const COUPLE = [
  {
    name: "김영서",
    englishName: "Youngseo Kim",
    birthDate:"1997.12.09",
    initial: "Y",
    photoIndex: 0,
    introduction: "마음의 방향을 알고, 웃음으로 하루를 밝히는 사람. 음악과 야구, 새로운 즐거움을 사랑하며 언제나 곁에서 함께 나아가게 하는 경쾌한 돛이 되어줍니다."
  },
  {
    name: "정진성",
    englishName: "Jinseong Jeong",
    birthDate:"1997.01.18",
    initial: "J",
    photoIndex: 1,
    introduction: "말의 무게를 알고, 행동으로 사랑을 보여주는 사람.운동과 책, 깊은 대화를 좋아하며 언제나 곁에서 든든히 자리를 지키는 단단한 닻이 되어줍니다."
  },
];

const INTERVIEW = [
  {
    question: "서로의 첫인상은?",
    bride: "성실하고 다정다감한 귀여운 구석이 있는 사람",
    groom: "",
  },
  {
    question: "가장 사랑스러운 순간은?",
    bride: "사소한 말장난을 하고 개구지게 웃을 때",
    groom: "",
  },
  {
    question: "함께 그리고 싶은 모습은?",
    bride: "서로의 가장 기쁜 순간도 슬픈 순간도 함께 나누는 사이",
    groom: "",
  },
];

export default function CoupleInterview() {
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const photos = useGalleryPhotos();

  return (
    <section id="section-couple" className="couple-section">
      <header className="couple-heading invitation-section-heading">
        <p className="section-title">About us</p>
        <h2>두 사람을 소개합니다</h2>
        <p>서로에게 가장 든든한 편이 되어주기로 한<br/>두 사람의 이야기</p>
      </header>

      <div className="couple-profiles">
        {COUPLE.map((person) => (
          <article key={person.name} className="couple-profile">
            <div className="couple-monogram">
              {photos[person.photoIndex] ? (
                <Image
                  src={photos[person.photoIndex].url}
                  alt={`${person.name} 사진`}
                  fill
                  sizes="(max-width: 480px) 36vw, 160px"
                  className="object-cover"
                />
              ) : (
                <span aria-hidden="true">{person.initial}</span>
              )}
            </div>
            <h3>{person.name}</h3>
            <p className="couple-english-name">{person.englishName}</p>
            <p className="couple-birth-date">{person.birthDate}</p>
            <p className="couple-introduction" style={{ whiteSpace: "pre-line" }}>{person.introduction}</p>
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
            <span className="interview-label">A little interview</span>
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
