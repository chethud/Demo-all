import type { Template } from "@/lib/types";

const FILE_PATH = "data/templates.json";

function repoConfig() {
  const token = process.env.GITHUB_TOKEN?.trim();
  const repo = process.env.GITHUB_REPO?.trim() || "chethud/Demo-all";
  const branch = process.env.GITHUB_BRANCH?.trim() || "main";
  return { token, repo, branch };
}

export function isGitHubStoreEnabled(): boolean {
  return Boolean(process.env.GITHUB_TOKEN?.trim());
}

async function githubFetch(path: string, init?: RequestInit) {
  const { token } = repoConfig();
  if (!token) {
    throw new Error("GITHUB_TOKEN is not configured");
  }

  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  return response;
}

export async function readTemplatesFromGitHub(): Promise<Template[]> {
  const { repo, branch } = repoConfig();
  const response = await githubFetch(
    `/repos/${repo}/contents/${FILE_PATH}?ref=${encodeURIComponent(branch)}`,
  );

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub read failed (${response.status}): ${text}`);
  }

  const data = (await response.json()) as { content?: string; encoding?: string };
  if (!data.content) {
    throw new Error("GitHub file content missing");
  }

  const decoded = Buffer.from(data.content, "base64").toString("utf8");
  const parsed = JSON.parse(decoded) as Template[];
  if (!Array.isArray(parsed)) {
    throw new Error("templates.json must be an array");
  }
  return parsed;
}

export async function writeTemplatesToGitHub(
  templates: Template[],
): Promise<void> {
  const { repo, branch } = repoConfig();

  const existing = await githubFetch(
    `/repos/${repo}/contents/${FILE_PATH}?ref=${encodeURIComponent(branch)}`,
  );

  let sha: string | undefined;
  if (existing.ok) {
    const body = (await existing.json()) as { sha?: string };
    sha = body.sha;
  } else if (existing.status !== 404) {
    const text = await existing.text();
    throw new Error(`GitHub lookup failed (${existing.status}): ${text}`);
  }

  const content = Buffer.from(
    `${JSON.stringify(templates, null, 2)}\n`,
    "utf8",
  ).toString("base64");

  const response = await githubFetch(`/repos/${repo}/contents/${FILE_PATH}`, {
    method: "PUT",
    body: JSON.stringify({
      message: "chore: update showcase templates via admin",
      content,
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub write failed (${response.status}): ${text}`);
  }
}
