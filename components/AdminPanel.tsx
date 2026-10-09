"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, type Category, type Template } from "@/lib/types";

type FormState = {
  name: string;
  slug: string;
  vercelUrl: string;
  category: Category;
  description: string;
  thumbnail: string;
  tags: string;
  featured: boolean;
};

const emptyForm: FormState = {
  name: "",
  slug: "",
  vercelUrl: "",
  category: "Other",
  description: "",
  thumbnail: "",
  tags: "",
  featured: false,
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function AdminPanel() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const loadSession = useCallback(async () => {
    const res = await fetch("/api/admin/session", { cache: "no-store" });
    const data = (await res.json()) as { authenticated: boolean };
    setAuthenticated(data.authenticated);
    return data.authenticated;
  }, []);

  const loadTemplates = useCallback(async () => {
    const res = await fetch("/api/templates", { cache: "no-store" });
    const data = (await res.json()) as { templates: Template[] };
    setTemplates(data.templates ?? []);
  }, []);

  useEffect(() => {
    void (async () => {
      const ok = await loadSession();
      if (ok) await loadTemplates();
    })();
  }, [loadSession, loadTemplates]);

  const sorted = useMemo(
    () =>
      [...templates].sort((a, b) => {
        const featuredDiff =
          Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        if (featuredDiff !== 0) return featuredDiff;
        return a.name.localeCompare(b.name);
      }),
    [templates],
  );

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Login failed");
      }
      setPassword("");
      setAuthenticated(true);
      await loadTemplates();
      setMessage("Signed in");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setAuthenticated(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setTemplates([]);
    setMessage("Signed out");
  }

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug || slugify(form.name),
          vercelUrl: form.vercelUrl,
          category: form.category,
          description: form.description,
          thumbnail: form.thumbnail || undefined,
          tags: form.tags,
          featured: form.featured,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to add website");
      setForm(emptyForm);
      await loadTemplates();
      setMessage("Website added to the showcase");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add website");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(slug: string, name: string) {
    if (!window.confirm(`Delete “${name}”?`)) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/templates/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      await loadTemplates();
      setMessage(`Deleted “${name}”`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setBusy(false);
    }
  }

  if (authenticated === null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center text-sm text-charcoal/55">
        Checking admin session…
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl text-[#1a1a1a]">Admin</h1>
        <p className="mt-2 text-sm text-[#444444]">
          Sign in to add or delete website demos.
        </p>
        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-[#333333]">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#d4d0c8] bg-white px-3.5 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-maroon"
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="text-sm font-medium text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#1a1a1a] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-charcoal">Admin</h1>
          <p className="mt-1 text-sm text-charcoal/60">
            Add or delete websites shown on the showcase.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="rounded-xl border border-charcoal/12 px-3.5 py-2 text-sm text-charcoal/70 hover:text-charcoal"
          >
            View showcase
          </Link>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="rounded-xl border border-charcoal/12 px-3.5 py-2 text-sm text-charcoal/70 hover:text-charcoal"
          >
            Sign out
          </button>
        </div>
      </div>

      {(message || error) && (
        <div
          className={`mt-6 rounded-xl px-4 py-3 text-sm ${
            error
              ? "border border-red-200 bg-red-50 text-red-800"
              : "border border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {error || message}
        </div>
      )}

      <form
        onSubmit={handleAdd}
        className="mt-8 rounded-2xl border border-charcoal/10 bg-white p-5 sm:p-6"
      >
        <h2 className="font-display text-xl text-charcoal">Add website</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Project name" required>
            <input
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  name: e.target.value,
                  slug: f.slug || slugify(e.target.value),
                }))
              }
              className={inputClass}
              placeholder="Mysore Silk Website"
              required
            />
          </Field>
          <Field label="Slug">
            <input
              value={form.slug}
              onChange={(e) =>
                setForm((f) => ({ ...f, slug: slugify(e.target.value) }))
              }
              className={inputClass}
              placeholder="mysore-silk"
            />
          </Field>
          <Field label="Vercel URL" required className="sm:col-span-2">
            <input
              value={form.vercelUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, vercelUrl: e.target.value }))
              }
              className={inputClass}
              placeholder="https://your-project.vercel.app"
              required
            />
          </Field>
          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  category: e.target.value as Category,
                }))
              }
              className={inputClass}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Thumbnail path (optional)">
            <input
              value={form.thumbnail}
              onChange={(e) =>
                setForm((f) => ({ ...f, thumbnail: e.target.value }))
              }
              className={inputClass}
              placeholder="/templates/mysore-silk.jpg"
            />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className={`${inputClass} min-h-24`}
              placeholder="Short description for clients"
            />
          </Field>
          <Field label="Tags (comma separated)">
            <input
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              className={inputClass}
              placeholder="Luxury, Traditional"
            />
          </Field>
          <label className="flex items-center gap-2 self-end pb-2 text-sm text-charcoal/70">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                setForm((f) => ({ ...f, featured: e.target.checked }))
              }
              className="h-4 w-4 rounded border-charcoal/20"
            />
            Featured (show near the top)
          </label>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="mt-5 rounded-xl bg-charcoal px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {busy ? "Saving…" : "Add website"}
        </button>
      </form>

      <section className="mt-10">
        <h2 className="font-display text-xl text-charcoal">
          Current websites ({sorted.length})
        </h2>
        <ul className="mt-4 divide-y divide-charcoal/8 overflow-hidden rounded-2xl border border-charcoal/10 bg-white">
          {sorted.length === 0 ? (
            <li className="px-5 py-10 text-center text-sm text-charcoal/50">
              No websites yet. Add your first Vercel link above.
            </li>
          ) : (
            sorted.map((template, index) => (
              <li
                key={template.slug}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-charcoal">
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-xs text-white">
                      {index + 1}
                    </span>
                    {template.name}
                  </p>
                  <p className="mt-1 truncate text-xs text-charcoal/45">
                    {template.vercelUrl}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/preview/${template.slug}`}
                    className="rounded-lg border border-charcoal/12 px-3 py-1.5 text-xs text-charcoal/70 hover:text-charcoal"
                  >
                    Preview
                  </Link>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      void handleDelete(template.slug, template.name)
                    }
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700 hover:bg-red-100 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-charcoal/12 bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none focus:border-charcoal/30";

function Field({
  label,
  children,
  required,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block text-sm text-charcoal/70 ${className}`}>
      {label}
      {required ? " *" : ""}
      {children}
    </label>
  );
}
