"use client";

import { useEffect, useRef, useState } from "react";

interface LivePreviewThumbProps {
  url: string;
  title: string;
}

const FRAME_WIDTH = 1280;

export function LivePreviewThumb({ url, title }: LivePreviewThumbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const width = el.clientWidth || FRAME_WIDTH;
      setScale(width / FRAME_WIDTH);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (failed) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-[#ebe6dc] px-6 text-center">
        <p className="text-sm font-medium text-charcoal/55">{title}</p>
        <p className="text-xs text-charcoal/40">
          Live preview blocked — open Ready to view
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-white">
      <iframe
        title={`${title} homepage preview`}
        src={url}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        sandbox="allow-scripts allow-same-origin"
        className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 bg-white"
        style={{
          width: `${FRAME_WIDTH}px`,
          height: `${Math.ceil(FRAME_WIDTH * 0.7)}px`,
          transform: `scale(${scale})`,
        }}
        onError={() => setFailed(true)}
      />
      <div className="absolute inset-0 z-[1]" aria-hidden />
    </div>
  );
}
