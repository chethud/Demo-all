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
Admin add/delete works without a GitHub token (saves to Vercel’s writable `/tmp` + memory cache).

Set `ADMIN_PASSWORD` in Vercel Environment Variables, then redeploy.

Optional: set `GITHUB_TOKEN` + `GITHUB_REPO` if you also want permanent writes into the GitHub `templates.json` file.

Agency name / logo: edit `data/site.ts`.

## Deploy

```bash
npm run build
```

Deploy the project to Vercel. Share one hub URL with clients; each preview is available at `/preview/{slug}`.

## Notes

- Some sites block iframe embedding. The preview page shows a clear fallback with **Open Live Website**.
- Placeholder `vercelUrl` values are intentional examples — replace them with your real deployments.
