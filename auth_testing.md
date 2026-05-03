# Auth Testing Playbook - NSCW CMS

## Environment
- Backend: FastAPI on port 8001 (via supervisor)
- DB: MongoDB
- JWT_SECRET set in `/app/backend/.env`
- Admin seeded from ADMIN_EMAIL / ADMIN_PASSWORD env vars

## Credentials (see /app/memory/test_credentials.md)
- Admin: admin@nscw.nagaland.gov.in / Nscw@2026
- Editor: editor@nscw.nagaland.gov.in / Editor@2026

## Endpoints (all prefixed with /api)
- POST /api/auth/login
- POST /api/auth/logout (auth required)
- GET  /api/auth/me (auth required)
- POST /api/auth/refresh

## Curl Flow
```
API=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2)
curl -c /tmp/cookies.txt -X POST $API/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"admin@nscw.nagaland.gov.in","password":"Nscw@2026"}'
curl -b /tmp/cookies.txt $API/api/auth/me
```

## Mongo checks
```
mongosh
use nscw_cms
db.users.findOne({role:"admin"})
db.users.getIndexes()
db.login_attempts.getIndexes()
```
Verify bcrypt hash starts with `$2b$` and unique index on users.email.
