# Next Generation Role Readiness Check

An interactive management tool for assessing whether an important role should be recruited as it stands, refined, developed internally or redesigned as AI and automation change the work.

## What the site includes

- Seven plain-English questions completed in approximately three minutes
- A clear Keep, Update or Rethink position without an artificial numeric score
- Function-specific ideas for where technology could help
- Human strengths to protect and capabilities that may matter more
- Three tailored next actions
- Interactive task-shift mapper
- Printable Role Readiness Brief
- Local browser storage so working answers stay on the user's device
- Netlify form for requesting a complimentary one-page Role Decision Brief
- Same-page form confirmation, with a safe fallback route, so the assessment result is not lost after submission
- Responsive and accessible static design
- No cookies, analytics or third-party scripts

## Deploy to Netlify from GitHub

1. Create a new GitHub repository.
2. Upload or push the complete contents of this folder.
3. In Netlify, select **Add new site → Import an existing project**.
4. Choose the GitHub repository.
5. Netlify will detect `netlify.toml`; no build command is required and the publish directory is `dist`.
6. Deploy the site.

Netlify will detect the `role-review` form during deployment. Form submissions will appear under **Forms** in the Netlify site dashboard. Configure submission notifications in Netlify if email alerts are required. Deploy the complete repository (or the complete `dist` directory for a manual deploy); uploading only `index.html` will omit required assets and fallback pages.

For a drag-and-drop deployment, upload the contents of `dist` together. The included `_redirects` and `_headers` files preserve the form fallback, legacy confirmation redirect and security headers without relying on the repository-level configuration.

## GitHub Pages

The included workflow publishes the `dist` folder whenever the `main` branch is updated. In the repository, open **Settings → Pages** and set the source to **GitHub Actions**.

The Role Decision Brief form requires Netlify Forms. GitHub Pages can display the site, assessment and printable brief, but it cannot process that form by itself.

## Content and brand updates

- Main page: `dist/index.html`
- Assessment questions and result logic: `dist/app.js`
- Visual design: `dist/styles.css`
- Netlify settings and security headers: `netlify.toml`

The header currently uses a clean text treatment because no official logo asset was supplied. Replace the `.brand` element in `dist/index.html` with the approved Next Generation logo when available.

## Privacy behaviour

Assessment answers and task-map entries are saved only in the user's browser using `localStorage`. They are not included in the Netlify form submission. The request sends the contact details, role, decision question and derived result shown in the form area.

## Decision note

The result is a structured management prompt, not a psychometric instrument, legal opinion, workforce-displacement prediction or assessment of the current role holder. It is designed to help a manager decide what to examine next.
