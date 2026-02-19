import fs from "node:fs";
import process from "node:process";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function mustEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

async function main() {
  const prNumber = mustEnv("PR_NUMBER");
  const repo = mustEnv("REPO");
  const ghToken = mustEnv("GITHUB_TOKEN");

  const diff = fs.readFileSync("diff.txt", "utf8");
  const changedFiles = fs.readFileSync("changed_files.txt", "utf8");

  const rubric = `
You are a senior staff engineer reviewing a pull request.
Prioritize: Security > Correctness > Reliability > Performance > Readability.
Do NOT nitpick style unless it affects correctness or maintainability.

NEAR/Rust focus (if applicable): access control, panics/unwraps, overflow, storage accounting/refunds, cross-contract call safety.

Return Markdown with EXACT sections:

## Summary
## Blockers (must-fix)
## High-risk issues
## Medium/low issues
## Suggested tests
## Small patch suggestions (<=20 lines each)
## Questions for the author

If no items for a section, write "None".
Be concrete and reference filenames/lines when possible.
  `.trim();

  const model = process.env.OPENAI_MODEL || "gpt-4.1";

  const input = `
PR changed files:
${changedFiles}

Unified diff:
${diff}
  `.trim();

  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const resp = await openai.responses.create({
        model,
        input: [
          { role: "system", content: rubric },
          { role: "user", content: input }
        ],
        temperature: 0.2
      });

      const reviewText = (resp.output_text || "").trim() || "AI review produced no text output (unexpected).";

      const url = `https://api.github.com/repos/${repo}/issues/${prNumber}/comments`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ghToken}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json"
        },
        body: JSON.stringify({
          body: `### 🤖 AI PR Review\n\n${reviewText}\n\n---\n*Generated automatically in CI.*`
        })
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(`GitHub comment failed: ${res.status} ${t}`);
      }

      // Optional gating: fail if blockers section isn't None
      const blockersMatch = reviewText.match(/## Blockers \(must-fix\)\s*([\s\S]*?)\n## /);
      if (process.env.AI_GATE_BLOCKERS === "true" && blockersMatch && !/^\s*None\s*$/i.test(blockersMatch[1].trim())) {
        console.error("AI found blockers; failing check (AI_GATE_BLOCKERS=true).");
        process.exit(1);
      }

      console.log("AI review posted successfully.");
      return;
    } catch (e) {
      lastErr = e;
      const sleepMs = 500 * Math.pow(2, attempt) + Math.floor(Math.random() * 250);
      await new Promise((r) => setTimeout(r, sleepMs));
    }
  }

  throw lastErr;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
