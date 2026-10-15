"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type SyntheticEvent,
} from "react";
import { useAdminMedia } from "@/components/admin/admin-media-context";

type Props = {
  slot: string;
  fallback: string;
  alt: string;
  sizes?: string;
  className?: string;
  frameClassName?: string;
  priority?: boolean;
  /** Fill the frame (cards). Set false for the hero so the photo can size to its own width. */
  fill?: boolean;
  allowTransform?: boolean;
  objectPosition?: string;
};

type DragMode = "pan" | "scale" | null;

export function EditablePhoto({
  slot,
  fallback,
  alt,
  sizes = "100vw",
  className = "object-cover",
  frameClassName,
  priority,
  fill = true,
  allowTransform = true,
  objectPosition = "center",
}: Props) {
  const frameClass =
    frameClassName ?? (fill ? "absolute inset-0 z-[1]" : "relative z-[1] w-full");
  const { isAdmin, mediaFor, replaceSlot, updateTransform } = useAdminMedia();
  const photo = mediaFor(slot, fallback);
  const uploaded =
    photo.src.startsWith("data:") || photo.src.startsWith("/uploads/");
  const inputId = useId();
  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    mode: DragMode;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origScale: number;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState({ x: photo.x, y: photo.y, scale: photo.scale });
  const liveRef = useRef(live);
  liveRef.current = live;

  useEffect(() => {
    const next = { x: photo.x, y: photo.y, scale: photo.scale };
    liveRef.current = next;
    setLive(next);
  }, [photo.src, photo.x, photo.y, photo.scale]);

  const x = live.x;
  const y = live.y;
  const scale = live.scale;

  async function onFile(file: File) {
    setBusy(true);
    try {
      await replaceSlot(slot, file);
      setLive({ x: 0, y: 0, scale: 1 });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not upload that photo.");
    } finally {
      setBusy(false);
    }
  }

  function stopCardNavigation(e: SyntheticEvent) {
    e.stopPropagation();
  }

  function commit(next: { x: number; y: number; scale: number }) {
    setLive(next);
    updateTransform(slot, fallback, next);
  }

  function onPanStart(e: ReactPointerEvent) {
    if (!isAdmin || !allowTransform) return;
    if (e.pointerType === "touch") return;
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = {
      mode: "pan",
      startX: e.clientX,
      startY: e.clientY,
      origX: live.x,
      origY: live.y,
      origScale: live.scale,
    };
  }

  function onScaleStart(e: ReactPointerEvent) {
    if (!isAdmin || !allowTransform) return;
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = {
      mode: "scale",
      startX: e.clientX,
      startY: e.clientY,
      origX: live.x,
      origY: live.y,
      origScale: live.scale,
    };
  }

  function onPointerMove(e: ReactPointerEvent) {
    const d = drag.current;
    const box = frameRef.current;
    if (!d || !box) return;
    const w = box.clientWidth || 1;
    const h = box.clientHeight || 1;
    if (d.mode === "pan") {
      const next = {
        x: d.origX + ((e.clientX - d.startX) / w) * 100,
        y: d.origY + ((e.clientY - d.startY) / h) * 100,
        scale: d.origScale,
      };
      liveRef.current = next;
      setLive(next);
      return;
    }
    if (d.mode === "scale") {
      const delta = (e.clientX - d.startX + (e.clientY - d.startY)) / Math.max(w, h);
      const next = {
        x: d.origX,
        y: d.origY,
        scale: d.origScale + delta * 1.6,
      };
      liveRef.current = next;
      setLive(next);
    }
  }

  function onPointerUp() {
    if (!drag.current) return;
    drag.current = null;
    commit(liveRef.current);
  }

  const transform = `translate(${x}%, ${y}%) scale(${scale})`;
  const photoStyle = {
    transform,
    transformOrigin: `${objectPosition === "top" ? "center top" : "center center"}`,
    objectPosition,
  } as const;
  const imgClass = fill
    ? `absolute inset-0 h-full w-full select-none ${className}`
    : `block h-auto w-full max-w-full select-none ${className}`;
  const pointer = isAdmin && allowTransform ? "cursor-move" : "";

  return (
    <div
      ref={frameRef}
      className={`${frameClass} overflow-hidden`}
    >
      {uploaded ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo.src}
          alt={alt}
          draggable={false}
          className={`${imgClass} ${pointer}`}
          style={photoStyle}
          onPointerDown={isAdmin && allowTransform ? onPanStart : undefined}
          onPointerMove={isAdmin && allowTransform ? onPointerMove : undefined}
          onPointerUp={isAdmin && allowTransform ? onPointerUp : undefined}
          onPointerCancel={isAdmin && allowTransform ? onPointerUp : undefined}
        />
      ) : fill ? (
        <Image
          src={photo.src}
          alt={alt}
          fill
          draggable={false}
          className={`${className} ${pointer}`}
          sizes={sizes}
          priority={priority}
          style={photoStyle}
          onPointerDown={isAdmin && allowTransform ? onPanStart : undefined}
          onPointerMove={isAdmin && allowTransform ? onPointerMove : undefined}
          onPointerUp={isAdmin && allowTransform ? onPointerUp : undefined}
        />
      ) : (
        <Image
          src={photo.src}
          alt={alt}
          width={1920}
          height={1080}
          draggable={false}
          className={`${imgClass} ${pointer}`}
          sizes={sizes}
          priority={priority}
          style={photoStyle}
          onPointerDown={isAdmin && allowTransform ? onPanStart : undefined}
          onPointerMove={isAdmin && allowTransform ? onPointerMove : undefined}
          onPointerUp={isAdmin && allowTransform ? onPointerUp : undefined}
        />
      )}

      {isAdmin ? (
        <>
          <label
            htmlFor={inputId}
            className="absolute right-2 top-2 z-20 flex min-h-11 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#2f2426] px-4 py-2.5 text-xs font-semibold tracking-wide text-white shadow-md"
            onClick={stopCardNavigation}
            onPointerDown={stopCardNavigation}
            onTouchStart={stopCardNavigation}
          >
            {busy ? "Saving…" : "Upload photo"}
            <input
              id={inputId}
              type="file"
              accept="image/*"
              className="sr-only"
              onClick={stopCardNavigation}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onFile(file);
                e.target.value = "";
              }}
            />
          </label>

          {allowTransform ? (
            <>
              <div
                className="absolute bottom-3 left-3 right-10 z-30 flex items-center gap-2 rounded-full bg-[#2f2426]/85 px-3 py-1.5 text-white"
                onPointerDown={stopCardNavigation}
                onClick={stopCardNavigation}
              >
                <span className="text-[10px] font-semibold tracking-wide">Size</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={scale}
                  className="h-1 w-full accent-[#f3c4c8]"
                  onChange={(e) =>
                    commit({ x, y, scale: Number(e.target.value) })
                  }
                />
              </div>

              <button
                type="button"
                aria-label="Resize"
                className="absolute bottom-2 right-2 z-30 h-5 w-5 cursor-nwse-resize rounded-sm border-2 border-white bg-[#8b4a52] shadow"
                onPointerDown={onScaleStart}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onClick={stopCardNavigation}
              />
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
