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
          background: "#fff",
          color: "#44403c",
          fontSize: "13px",
          fontFamily: "var(--font-noto-serif-kr), serif",
          borderRadius: "12px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          padding: "12px 16px",
          maxWidth: "320px",
        },
        success: {
          iconTheme: {
            primary: "#f87171",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
          duration: 5000,
        },
        loading: {
          iconTheme: {
            primary: "#f87171",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
