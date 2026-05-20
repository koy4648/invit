"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      gutter={8}
      toastOptions={{
        duration: 3500,
        style: {
          background: "#fdfaf6",
          color: "#44403c",
          fontSize: "13px",
          fontFamily: "var(--font-noto-serif-kr), serif",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(180,140,80,0.15), 0 2px 8px rgba(0,0,0,0.06)",
          border: "1px solid rgba(212,169,106,0.25)",
          padding: "12px 16px",
          maxWidth: "320px",
          letterSpacing: "0.02em",
        },
        success: {
          iconTheme: { primary: "#b08840", secondary: "#fdfaf6" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#fff" },
          duration: 5000,
        },
        loading: {
          iconTheme: { primary: "#d4a96a", secondary: "#fdfaf6" },
        },
      }}
    />
  );
}