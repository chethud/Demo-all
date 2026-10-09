# Website Showcase

Premium demo hub for presenting multiple Vercel-hosted website templates from one shareable link.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin (add / delete websites)

Open [http://localhost:3000/admin](http://localhost:3000/admin).

Default password: set in `.env.local` as `ADMIN_PASSWORD`.

Templates are stored in `data/templates.json`. The admin page writes to that file locally.

Agency name / logo: edit `data/site.ts`.

## Deploy

```bash
npm run build
```

Deploy the project to Vercel. Share one hub URL with clients; each preview is available at `/preview/{slug}`.

## Notes

- Some sites block iframe embedding. The preview page shows a clear fallback with **Open Live Website**.
- Placeholder `vercelUrl` values are intentional examples — replace them with your real deployments.
