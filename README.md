# NFBPA Greater Houston — Command Dashboard

A single-page board execution dashboard for the NFBPA (National Forum for
Black Public Administrators) Greater Houston chapter. It tracks board roles,
tasks, membership, sponsorships, financial actuals, and re-engagement efforts
for the 2026 program year and 40th anniversary.

## Features

The dashboard is organized into the following sections:

| Section | Description |
| --- | --- |
| **Overview** | At-a-glance KPIs and charts for the chapter. |
| **Board** | Board of Directors roster and roles. |
| **Tasks** | Kanban-style task tracker (Not Started / In Progress / Blocked / Under Review / Complete). |
| **Members** | Member roster. |
| **Re-engage** | Lapsed/inactive member re-engagement tracking. |
| **Actuals** | Financial actuals — membership revenue, sponsorships, revenue channels. |
| **Sponsors** | Sponsorship pipeline and status. |
| **Organization** | Org structure and committee breakdown. |

State is persisted in the browser via `localStorage`, and the UI supports
light and dark themes.

## Tech stack

- **React 18** (UMD build, no JSX/build step — uses `React.createElement`)
- **Chart.js 4** for data visualization
- **EmailJS** for sending email from the client
- Plain CSS with custom theme tokens (light/dark)

All dependencies are loaded from a CDN, so there is no install or build step.

## Project structure

```
.
├── index.html        # Page shell: loads dependencies, CSS, and the app
├── css/
│   └── styles.css    # Theme tokens, layout, and component styles
└── js/
    └── app.js        # React application (all components and logic)
```

## Running locally

Because the app uses ES modules-free UMD scripts and `localStorage`, just serve
the directory over HTTP (opening `index.html` via `file://` works for most
features, but a local server avoids browser restrictions):

```bash
# Python 3
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser. An internet connection is
required on first load to fetch the CDN dependencies and Google Fonts.

## Deployment

The site is deployed to **GitHub Pages** via GitHub Actions. The workflow in
`.github/workflows/deploy.yml` publishes the repository contents to Pages on
every push to `main`. The live URL appears in the workflow run's `github-pages`
environment once deployed.

## Configuration

To send email, the app uses EmailJS. Credentials (service ID, template ID, and
public key) are entered through the in-app email settings and stored in the
browser's `localStorage` — nothing is hardcoded in the source. If EmailJS is
not configured, the app falls back to opening Gmail/Outlook web-compose links.
