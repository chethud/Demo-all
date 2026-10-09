# Website Showcase

Premium demo hub for presenting multiple Vercel-hosted website templates from one shareable link.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin (add / delete websites)

Open `/admin`.

Set `ADMIN_PASSWORD` in `.env.local` (local) and in Vercel Environment Variables (hosted).

### Local
Templates are saved to `data/templates.json`.

### Hosted on Vercel
Vercel’s filesystem is read-only. Admin add/delete needs a GitHub token:

1. Create a GitHub Personal Access Token with `repo` access to `chethud/Demo-all`
2. In Vercel → Project → Settings → Environment Variables, add:
   - `ADMIN_PASSWORD` = your admin password
   - `GITHUB_TOKEN` = your token
   - `GITHUB_REPO` = `chethud/Demo-all` (optional, this is the default)
   - `GITHUB_BRANCH` = `main` (optional)
3. Redeploy

Admin changes then update `data/templates.json` in GitHub live.

Agency name / logo: edit `data/site.ts`.

## Deploy

```bash
npm run build
```

Deploy the project to Vercel. Share one hub URL with clients; each preview is available at `/preview/{slug}`.

## Notes

- Some sites block iframe embedding. The preview page shows a clear fallback with **Open Live Website**.
- Placeholder `vercelUrl` values are intentional examples — replace them with your real deployments.
