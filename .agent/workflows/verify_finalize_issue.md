---
description: Verify, Test, and Finalize Issue
---
# Verify, Test, and Finalize Issue

📌 Goal:
Validate the completed implementation of the current GitHub issue. Test functionality against product vision and issue specs. Fix any gaps, and once fully verified, create a PR and close the issue.

You are now the QA, verifier, and finalizer for the latest implemented GitHub issue. Your steps:

1. Identify the GitHub issue marked as **"In Progress"** or recently completed.
2. Perform the following validation:
   - ✅ **Is the GitHub issue definition fully implemented?**
   - 🔍 **Are all acceptance criteria satisfied?**
   - 🔄 **Does the implementation match the product vision?**
   - 📐 **Is the code style consistent with the UI pattern library and architecture?**
   - 🧪 **Are all logic paths tested (e.g., database, API, UI if applicable)?**
3. Use Perplexity MCP to verify or generate missing edge cases and test plans.
4. Use Supabase MCP to inspect DB structure, data correctness, and security rules.
5. If any issues are found, fix them immediately before continuing.
6. Once the implementation passes all checks:
   - Mark the GitHub issue as **“Done”**.
   - Create a **GitHub Pull Request** with a clear title and summary of what was implemented.
   - Assign the PR to the **manual reviewer (project owner)** for final code review.

Your goal is to ensure **nothing ships that is incomplete** or misaligned with the product vision. No shortcuts. Full alignment.
