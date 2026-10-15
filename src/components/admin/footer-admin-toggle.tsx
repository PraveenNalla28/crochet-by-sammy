"use client";

import { useAdminMedia } from "@/components/admin/admin-media-context";

export function FooterAdminToggle() {
  const { ready, isAdmin, setMode } = useAdminMedia();
  if (!ready) return null;

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 text-xs text-text-muted"
      aria-pressed={isAdmin}
      onClick={() => setMode(isAdmin ? "viewer" : "admin")}
    >
      <span>{isAdmin ? "Admin" : "Viewer"}</span>
      <span
        className={`relative h-5 w-9 rounded-full ${isAdmin ? "bg-[#8b4a52]" : "bg-[#d9cfc6]"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${isAdmin ? "left-4" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}
