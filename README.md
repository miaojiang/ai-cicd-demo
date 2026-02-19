# AI-in-CI/CD Demo Repo (Intentional Bugs)

This repo is intentionally seeded with a handful of code-quality and security issues so you can demo an **AI PR reviewer** in GitHub Actions.

## What's inside

- **TypeScript**: a tiny "payments" helper + a pseudo "API handler".
- **Rust (NEAR contract)**: a minimal contract with a few common pitfalls.
- **GitHub Action**: `AI PR Review` that posts an AI review comment on every PR.

## Intentional issues (examples)

TypeScript:
- Missing input validation
- Insecure string comparison for a token check
- Logging a sensitive token
- Potential numeric precision issue

NEAR contract:
- Missing access control on `withdraw`
- Use of `unwrap()` on external input
- Unchecked arithmetic (potential underflow)

## Quick start

```bash
npm install
npm test
npm run build
```

Rust contract tests:

```bash
cd contract
cargo test
```

## How to demo

1. Add `OPENAI_API_KEY` to GitHub repo secrets.
2. Open a PR that changes a few lines in `src/index.ts` or `contract/src/lib.rs`.
3. Watch the GitHub Action post an AI review comment.

> Tip: For an impressive demo, make a PR that "fixes" one bug but introduces another.
