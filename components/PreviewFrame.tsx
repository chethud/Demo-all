"use client";

import { useCallback, useEffect, useState } from "react";
import { PreviewToolbar } from "@/components/PreviewToolbar";
import type { Template } from "@/lib/types";
import { getSafeVercelUrl } from "@/lib/url";

interface PreviewFrameProps {
  template: Template;
  templates: Template[];
  previous: Template | null;
  next: Template | null;
}

type EmbedState = "loading" | "ready" | "blocked" | "invalid";

export function PreviewFrame({
  template,
  templates,
  previous,
  next,
}: PreviewFrameProps) {
  const liveUrl = getSafeVercelUrl(template);
  const [embedState, setEmbedState] = useState<EmbedState>(
    liveUrl ? "loading" : "invalid",
  );

  useEffect(() => {
    setEmbedState(liveUrl ? "loading" : "invalid");
  }, [template.slug, liveUrl]);

  useEffect(() => {
    if (embedState !== "loading" || !liveUrl) return;
    const timer = window.setTimeout(() => {
      // Many sites load inside iframe but never fire a reliable cross-origin
      // signal. After a short wait we assume ready; X-Frame-Options failures
      // typically leave a blank frame — user can still use the fallback CTA.
      setEmbedState((current) => (current === "loading" ? "ready" : current));
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [embedState, liveUrl, template.slug]);

  const onIframeError = useCallback(() => {
    setEmbedState("blocked");
  }, []);

  const onIframeLoad = useCallback(() => {
    setEmbedState((current) =>
      current === "invalid" || current === "blocked" ? current : "ready",
    );
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#EFEDE8]">
      <PreviewToolbar
        template={template}
        templates={templates}
        previous={previous}
        next={next}
      />

      <div className="flex flex-1 justify-center px-3 pb-3 pt-20 sm:px-4 sm:pb-4">
        <div className="relative flex h-full w-full max-w-[1600px] flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-[0_16px_40px_rgba(20,20,20,0.08)]">
          {!liveUrl && (
            <FallbackPanel
              title="Invalid or missing live URL"
              body="Update the vercelUrl in data/templates.ts with a valid https:// link."
              liveUrl={null}
            />
          )}

          {liveUrl && embedState === "blocked" && (
            <FallbackPanel
              title="This website cannot be embedded"
              body="The live site is blocking iframe previews (X-Frame-Options or CSP). Open it in a new tab instead."
              liveUrl={liveUrl}
            />
          )}

          {liveUrl && embedState !== "blocked" && (
            <>
              {embedState === "loading" && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-charcoal/15 border-t-charcoal" />
                  <p className="text-sm text-charcoal/55">
                    Loading live preview…
                  </p>
                </div>
              )}
              <iframe
                key={template.slug}
                title={`${template.name} live preview`}
                src={liveUrl}
                className="h-full w-full flex-1 border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={onIframeLoad}
                onError={onIframeError}
              />
              <div className="flex items-center justify-between gap-3 border-t border-charcoal/8 bg-[#FAFAF8] px-4 py-2.5 text-xs text-charcoal/50">
                <p>
                  Preview may appear blank if the site blocks embedding.
                </p>
                <button
                  type="button"
                  onClick={() => setEmbedState("blocked")}
                  className="shrink-0 underline-offset-2 hover:text-charcoal hover:underline"
                >
                  Having trouble? Show fallback
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FallbackPanel({
  title,
  body,
  liveUrl,
}: {
  title: string;
  body: string;
  liveUrl: string | null;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="rounded-full border border-charcoal/10 bg-[#F3F1EC] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-charcoal/50">
        Preview unavailable
      </div>
      <h2 className="font-display text-2xl text-charcoal">{title}</h2>
      <p className="max-w-md text-sm leading-relaxed text-charcoal/60">{body}</p>
      {liveUrl && (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex rounded-xl bg-charcoal px-5 py-2.5 text-sm font-medium text-white transition hover:bg-charcoal/90"
        >
          Open Live Website
        </a>
      )}
    </div>
  );
}
