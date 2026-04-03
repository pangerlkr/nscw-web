# Nagaland State Commission for Women (NSCW) Web Experience

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-id/deploy-status)](https://app.netlify.com/sites/your-site/deploys)

A High-End Editorial Narrative digital experience designed for the **Nagaland State Commission for Women (NSCW)**. This platform moves away from traditional static government portals, serving as an immersive digital chronicle for documenting progress, defending rights, and curating the future of equity for women in Nagaland.

## 🏛️ Project Vision

The NSCW website is built as a "Digital Curator Aesthetic" platform, prioritizing:
- **Editorial Narrative:** A storytelling-first approach to government information.
- **Modern UI/UX:** Utilizing intentional asymmetry, negative space, and sleek glassmorphism.
- **AiEO & SEO:** Optimized for both traditional search engines and AI-driven discovery (AiEO).

## 🚀 Tech Stack

- **Foundational:** Vanilla HTML5 / CSS3 / JavaScript
- **Styling:** Tailwind CSS (via optimized CDN/Runtime engine)
- **Typography:** Display (Plus Jakarta Sans), Body (Inter), Labels (Manrope)
- **Deployment:** Netlify (with clean URL routing)
- **SEO/AiEO:** Schema.org JSON-LD structured data and semantic HTML5 fragments.

## 📁 Architecture

The project follows a clean, organized structure:
- **`public/`**: Static site assets (HTML pages, robots.txt, manifest, etc.)
- **`scripts/`**: Python utility scripts for development and optimization.
- **`docs/`**: Project documentation including `PRD.md` and the `Design_System.json`.

The platform consists of high-performance static pages in `public/`:
- `Home.html`, `About.html`, `Legal_Framework.html`, `The_Chronicle.html`, etc.

## 🛠️ Development & Operations

Utility scripts are located in the `scripts/` folder and can be run via `npm`:
- `npm run dev`: Local development server with clean URL support (`scripts/dev_server.py`).
- `npm run optimize`: Asset and HTML optimization script (`scripts/optimize.py`).
- `npm run migrate`: Utility to handle path translations (`scripts/migrate_to_clean_urls.py`).

## 📦 Deployment

This project is optimized for deployment on **Netlify**.
- **Redirects:** Managed via `_redirects` and `netlify.toml`.
- **Headers:** Security and caching headers configured for high performance.
- **CI/CD:** Automatic builds and previews on branch updates.

---
© 2026 Nagaland State Commission for Women. All rights reserved.
