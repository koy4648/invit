"use client";

import { useState } from "react";
import { ChevronDown, Copy, Phone } from "lucide-react";
import toast from "react-hot-toast";

interface FamilyContact {
  role: string;
  name: string;
  phone: string;
  bank?: string;
  account?: string;
}

const BRIDE_CONTACTS: FamilyContact[] = [
  { role: "신부", name: "김영서", phone: "010-5149-4648", bank: "우리은행", account: "987-654-321098" },
  { role: "신부 아버지", name: "김형태", phone: "010-9010-4648", bank: "하나은행", account: "555-666-777888" },
  { role: "신부 어머니", name: "정옥화", phone: "010-5239-4648" },
];

const GROOM_CONTACTS: FamilyContact[] = [
  { role: "신랑", name: "정진성", phone: "010-2357-7375", bank: "국민은행", account: "123-456-789012" },
  { role: "신랑 아버지", name: "정병철", phone: "010-2345-6789", bank: "신한은행", account: "111-222-333444" },
  { role: "신랑 어머니", name: "김명주", phone: "010-3456-7890" },
];

async function copyAccount(contact: FamilyContact) {
  if (!contact.account) return;
  try {
    await navigator.clipboard.writeText(contact.account);
    toast.success(`${contact.name}님의 계좌번호가 복사되었습니다.`);
  } catch {
    toast.error("계좌번호 복사에 실패했습니다.");
  }
}

function ContactCard({ contact, side }: { contact: FamilyContact; side: "bride" | "groom" }) {
  return (
    <article className={`family-contact-card ${side}`}>
      <header className="family-contact-name">
        <span>{contact.role}</span>
        <strong>{contact.name}</strong>
      </header>

      <div className="family-contact-row">
        <div>
          <span>전화번호</span>
          <p>{contact.phone}</p>
        </div>
        <a
          href={`tel:${contact.phone.replace(/-/g, "")}`}
          className="invitation-action family-contact-button"
          aria-label={`${contact.name}에게 전화하기`}
        >
          <Phone size={15} /> 전화하기
        </a>
      </div>

      <div className="family-contact-row">
        <div>
          <span>계좌번호</span>
          {contact.account ? (
            <p>{contact.account} <small>({contact.bank})</small></p>
          ) : (
            <p className="family-contact-pending">추후 안내</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => copyAccount(contact)}
          disabled={!contact.account}
          className="invitation-action-soft family-contact-button"
          aria-label={`${contact.name} 계좌번호 복사하기`}
        >
          <Copy size={15} /> 복사하기
        </button>
      </div>
    </article>
  );
}

function ContactGroup({
  side,
  title,
  contacts,
}: {
  side: "bride" | "groom";
  title: string;
  contacts: FamilyContact[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`family-contact-group ${side}`}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="family-contact-toggle"
        aria-expanded={isOpen}
      >
        <div>
          <span>{side === "bride" ? "YOUNGSEO'S FAMILY" : "JINSEONG'S FAMILY"}</span>
          <strong>{title}</strong>
        </div>
        <ChevronDown size={20} className={isOpen ? "is-open" : ""} />
      </button>

      {isOpen && (
        <div className="family-contact-list">
          {contacts.map((contact) => (
            <ContactCard key={contact.phone} contact={contact} side={side} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FamilyContacts() {
  return (
    <section id="section-contacts" className="family-contacts-section">
      <header className="family-contacts-heading">
        <p className="section-title">Contact</p>
        <h2>연락처 및 마음 전하실 곳</h2>
        <p>전화번호와 계좌번호를 확인하실 수 있습니다.</p>
      </header>

      <div className="family-contact-groups">
        <ContactGroup side="bride" title="영서의 가족" contacts={BRIDE_CONTACTS} />
        <ContactGroup side="groom" title="진성의 가족" contacts={GROOM_CONTACTS} />
      </div>
    </section>
  );
}
