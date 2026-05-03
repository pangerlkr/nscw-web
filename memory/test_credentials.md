# NSCW CMS — Test Credentials

## Admin
- Email: `admin@nscw.nagaland.gov.in`
- Password: `Nscw@2026`
- Role: `admin` (full access, incl user management)

## Editor
- Email: `editor@nscw.nagaland.gov.in`
- Password: `Editor@2026`
- Role: `editor` (content only, no user management)

## Endpoints
- Public site: `/`
- Admin login: `/admin/login`
- Admin dashboard: `/admin`

## API base
`${REACT_APP_BACKEND_URL}/api`

## Auth flow
- `POST /api/auth/login` { email, password } -> sets httpOnly cookies + returns user
- `GET /api/auth/me` -> current user from cookie
- `POST /api/auth/logout`
- `POST /api/auth/refresh`

## Notes
- Admin & editor are seeded on backend startup if missing.
- Passwords are bcrypt-hashed (`$2b$`).
- JWT access token TTL: 12h, refresh: 7d.
