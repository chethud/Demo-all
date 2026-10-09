import Link from "next/link";

export default function PreviewNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.18em] text-charcoal/45">
        404
      </p>
      <h1 className="mt-3 font-display text-3xl text-charcoal">
        Template not found
      </h1>
      <p className="mt-3 text-sm text-charcoal/60">
        This preview slug is not listed in{" "}
        <code className="rounded bg-charcoal/5 px-1.5 py-0.5 text-xs">
          data/templates.ts
        </code>
        .
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-xl bg-charcoal px-4 py-2.5 text-sm text-white"
      >
        Back to all templates
      </Link>
    </div>
  );
}
