## Secret Admin Access (ENV-Based) — Landora

This project intentionally **does not** use a normal admin signup/login system.
Admin access is controlled **only via environment variables** + a **secret URL**.

### How it works

- **Secret entry page**: `"/admin-access"`
  - Minimal form (no navbar/footer, no public links)
  - On successful verification, it sets an **HttpOnly cookie**: `admin_session`
- **Route protection**: all `"/admin/*"` routes are protected by **Next.js Middleware**
  - If `admin_session` is missing/invalid → user is redirected to `"/admin-access"`
- **Backend access**:
  - Backend `authenticate` middleware also accepts `admin_session` cookie (ENV-based admin)
  - This allows admin UI to call backend APIs **without localStorage** / normal admin auth

### Required environment variables

Add these to **frontend** env (server-only; no `NEXT_PUBLIC_` prefix):

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
  - Recommended: **bcrypt hash**
  - Supported: **plain text** (will be hashed in-memory server-side and compared via bcrypt)
- `ADMIN_AUTH_SECRET` (random long secret used to sign `admin_session`)

Add the same `ADMIN_AUTH_SECRET` (and optionally `ADMIN_EMAIL`) to **backend** env too,
so backend can verify the cookie.

Optional (backend):

- `ADMIN_ACTOR_ID` (defaults to `000000000000000000000001`)

### Generate a bcrypt hash for `ADMIN_PASSWORD`

Run this in the `frontend/` folder:

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash(process.argv[1], 12).then(h=>console.log(h))" "YourStrongAdminPasswordHere"
```

Copy the printed hash into:

- `ADMIN_PASSWORD=$2a$...`

### Verify

1. Go to `"/admin/dashboard"` → you should be redirected to `"/admin-access"`.
2. Go to `"/admin-access"` → enter credentials → redirected to `"/admin/dashboard"`.
3. Refresh the page → should stay logged in until cookie expiry (8 hours by default).


