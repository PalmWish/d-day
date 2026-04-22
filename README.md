# d-day-api

Express.js API boilerplate (inspired by [hagopj13/node-express-boilerplate](https://github.com/hagopj13/node-express-boilerplate)).

## 1) Install

```bash
npm install
```

## 2) Environment files (dev/prod separated)

This project reads environment variables by `NODE_ENV`:

- `NODE_ENV=dev` -> loads `.env.dev`
- `NODE_ENV=prod` -> loads `.env.prod`

Create env files:

```bash
cat > .env.dev << 'EOF'
NODE_ENV=dev
APP_NAME=d-day-api
PORT=3000
API_PREFIX=/v1
EOF

cat > .env.prod << 'EOF'
NODE_ENV=prod
APP_NAME=d-day-api
PORT=3000
API_PREFIX=/v1
EOF
```

## 3) Run local

```bash
npm run dev
```

Health check:

```bash
curl http://localhost:3000/v1/health
```

## 4) Run production mode

```bash
NODE_ENV=prod npm start
```

## 5) Docker

Build image:

```bash
docker build -t d-day-api:latest .
```

Run container:

```bash
docker run --rm -p 3000:3000 d-day-api:latest
```

## 6) Conventional Commit with Husky + Commitlint

This repo validates commit messages against Conventional Commits:
- Spec: https://www.conventionalcommits.org/th/v1.0.0/

Example valid messages:

```text
feat: add health check endpoint
fix: handle missing env variable
docs: update setup guide
chore: update dependencies
```

If message does not follow convention, commit will be rejected by `.husky/commit-msg` hook.

## 7) Run seed Booths

For inserting the created booths into the database from the config file (JSON/CSV).

```bash
npm run seed:booths
```
