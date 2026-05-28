"use client";

import { Calendar } from "lucide-react";
import toast from "react-hot-toast";

interface CalendarLinkProps {
  eventTitle?: string;
  eventDate?: string; // YYYY-MM-DD
  eventTime?: string; // HH:MM
  eventLocation?: string;
  eventDescription?: string;
}

export default function CalendarLink({
  eventTitle = "김민준 ♥ 이서연 결혼식",
  eventDate = "2025-10-18",
  eventTime = "11:00",
  eventLocation = "보테가마지오 로스타뇨홀",
  eventDescription = "저희의 결혼식에 초대합니다.",
}: CalendarLinkProps) {
  // .ics 파일 생성 및 다운로드
  const downloadICS = () => {
    const [year, month, day] = eventDate.split("-");
    const [hour, minute] = eventTime.split(":");

    // 종료 시간은 1시간 후로 설정
    const endHour = String(parseInt(hour) + 1).padStart(2, "0");

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${eventTitle}
X-WR-TIMEZONE:Asia/Seoul
BEGIN:VEVENT
UID:${Date.now()}@wedding-invitation
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${year}${month}${day}T${hour}${minute}00+0900
DTEND:${year}${month}${day}T${endHour}${minute}00+0900
SUMMARY:${eventTitle}
LOCATION:${eventLocation}
DESCRIPTION:${eventDescription}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/calendar;charset=utf-8," + encodeURIComponent(icsContent)
    );
    element.setAttribute("download", "wedding-invitation.ics");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("캘린더 파일이 다운로드되었습니다.");
  };

  // 구글 캘린더 추가
  const addToGoogleCalendar = () => {
    const [year, month, day] = eventDate.split("-");
    const [hour, minute] = eventTime.split(":");

    // 종료 시간은 1시간 후로 설정
    const endHour = String(parseInt(hour) + 1).padStart(2, "0");

    const startDateTime = `${year}${month}${day}T${hour}${minute}00`;
    const endDateTime = `${year}${month}${day}T${endHour}${minute}00`;

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDateTime}/${endDateTime}&location=${encodeURIComponent(eventLocation)}&details=${encodeURIComponent(eventDescription)}`;

    window.open(googleCalendarUrl, "_blank");
    toast.success("구글 캘린더로 이동합니다.");
  };

  return (
    <div className="px-6 py-4 space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={20} style={{ color: "#d4a96a" }} />
        <h3
          className="text-lg font-light tracking-wider"
          style={{ color: "#44403c" }}
        >
          캘린더 등록
        </h3>
      </div>

      <p className="text-sm mb-4" style={{ color: "#78716c" }}>
        {eventDate} {eventTime}
        <br />
        {eventLocation}
      </p>

      <div className="flex gap-2">
        <button
          onClick={downloadICS}
          className="flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-white text-sm"
          style={{
            background: "linear-gradient(135deg, #d4a96a, #b08840)",
          }}
        >
          📥 .ics 다운로드
        </button>
        <button
          onClick={addToGoogleCalendar}
          className="flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-white text-sm"
          style={{
            background: "linear-gradient(135deg, #4285F4, #34A853)",
          }}
        >
          📅 구글 캘린더
        </button>
      </div>
    </div>
  );
}
