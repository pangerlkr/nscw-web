# NSCW CMS — Product Requirements Document

## 1. Original Problem Statement
> "On this repo, is a website - I want to add a content Management Dashboard so admin and team can update contents to the website"

The repository contains an existing static HTML editorial website for the **Nagaland State Commission for Women (NSCW)** built with vanilla HTML + Tailwind CSS. The goal is to add a full CMS dashboard so admins and the team can update website content dynamically.

## 2. User Choices
- Auth: **JWT email + password** (no Google SSO)
- Content sections: **All of the above** (Homepage, Chronicle, Reports, OSC Directory, Team, Grievances, About)
- Roles: **Admin + Editor** (editor cannot manage users)
- Images: **URLs only** (no uploads)
- Design: **Match existing NSCW editorial theme** (purple #5B2D8E / cerulean #1175A8 / gold #B8760A, Plus Jakarta Sans / Inter / Manrope)

## 3. User Personas
- **Admin** — Full platform access. Manages content AND user accounts. Seeded at startup.
- **Editor** — Content curator. Can edit all site content, publish chronicle posts, update directory, resolve grievances. Cannot create/delete team accounts.
- **Public Citizen** — Browses site, reads chronicles/reports/directory, submits grievances.

## 4. Architecture
- **Backend**: FastAPI + Motor (MongoDB) + JWT (PyJWT) + bcrypt. Single `server.py` under `/app/backend/`.
- **Frontend**: React (CRA) + React Router 6 + Tailwind + axios + react-hot-toast. Under `/app/frontend/`.
- **Auth**: HttpOnly cookies (access 12h, refresh 7d), `samesite=none; secure=true` for HTTPS preview. Brute-force lockout (5 attempts -> 15m) keyed on email.
- **Data**: UUID string `_id`s throughout. Collections: `users`, `site_content`, `chronicle_posts`, `reports`, `directory`, `team`, `grievances`, `login_attempts`.

## 5. Core Requirements (Implemented)

### Public site
- Home page (CMS-driven hero, mandate, 3 operational pillars, CTA)
- About page (vision/mission + team list)
- Legal Framework (static acts list with PDF)
- Chronicle list + individual post page
- Reports list (year-grouped cards, PDF download)
- Support directory (district-wise OSC cards)
- Connect page (address/phone/email)
- Grievance form (public submit)
- Privacy page
- 404 page

### Admin CMS (`/admin/*`)
- Login page (with demo-credentials hint)
- Overview dashboard with live counts + quick actions
- Homepage editor (hero, mandate, pillars, CTA — grouped sections)
- About page editor
- Chronicle Posts manager (table + modal CRUD, slug uniqueness)
- Annual Reports manager
- OSC Directory manager
- Team Members manager
- Grievances Inbox with filters + status workflow (new/in_review/resolved/dismissed)
- Users manager (admin-only; disabled "delete self")

## 6. What's Been Implemented (2026-05-03)
- Full FastAPI backend with 30+ endpoints + startup seeding
- Full React frontend (21 routes: 10 public + 11 admin) matching the NSCW editorial theme
- Brute-force lockout (email-based, proxy-safe)
- Bcrypt password hashing, JWT access+refresh cookies
- Role-based access control (`require_admin`, `require_editor_or_admin`)
- Cache-Control: no-store on content endpoints for instant publish-to-live reflection
- Seeded: admin user, editor user, sample homepage/about content, 3 chronicle posts, 2 reports, 4 OSC entries, 3 team members
- Test credentials file at `/app/memory/test_credentials.md`
- Auth testing playbook at `/app/auth_testing.md`

### Verified (testing subagent iteration_1 + manual verification)
- 32/33 backend pytest cases (1 bug found and FIXED: brute-force lockout now triggers correctly behind kube ingress + timezone-aware comparison fix)
- 14/14 frontend UI flows: login, dashboard, all manager CRUD, editor role restrictions, logout
- Grievance public submit -> admin inbox -> status update
- Homepage editor save -> live reflection on `/` (verified with cache-bust header)

## 7. Backlog / Deferred
- **P1**: Rich text / markdown editor for Chronicle body (currently plain textarea)
- **P2**: Media library with actual image uploads (currently URLs only as per user choice)
- **P2**: Email notifications on new grievance (SendGrid/Resend integration)
- **P2**: Audit log of who edited what content
- **P3**: Multi-language (English / Nagamese / Ao / Angami translations)
- **P3**: Public `/mandate` and `/milestones` pages (originals exist in static repo but not yet ported)
- **P3**: Silence React Router v6 future-flag console warnings (cosmetic)

## 8. Next Actions
1. Expand Chronicle body editor to a lightweight markdown/rich text editor
2. Add simple charts to the Overview dashboard (grievances trend)
3. Wire SendGrid for grievance email notifications (requires user to supply key)
