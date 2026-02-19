# PR Review Rubric (Used by CI)

Priorities: **Security > Correctness > Reliability > Performance > Readability**

Output format:
- Summary
- Blockers (must-fix)
- High-risk issues
- Medium/low issues
- Suggested tests
- Small patch suggestions (<=20 lines each)
- Questions for author

NEAR/Rust focus:
- Access control and authorization
- Avoid panics in externally reachable paths (`unwrap`, `expect`)
- Overflow/underflow (use checked math)
- Storage accounting / refunds
- Cross-contract calls and callbacks safety
