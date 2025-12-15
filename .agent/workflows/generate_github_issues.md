---
description: Generate GitHub Issues From Product Vision
---
# Generate GitHub Issues From Product Vision

📌 Goal:
Analyze the complete product vision for the KOMPASS system. Break it down into well-structured, sequential GitHub issues in implementation order. Use the Perplexity MCP for best practices, design guidance, and up-to-date implementation standards. Each issue must represent a self-contained unit of value from the product vision, prioritized according to implementation dependencies (e.g., start with foundational domain models, then data structures, APIs, UIs, integrations).

You are now tasked with turning the full product vision for the KOMPASS system into a complete GitHub issue plan that will drive development from scratch.

1. Read the full product vision (which should be available in the context or provided).
2. Create a **comprehensive list of GitHub issues** in the **correct build order** (start from domain models, DB schema, backend logic, APIs, then move to UI and integration).
3. For each GitHub issue:
   - Title should be clear, concise, and descriptive.
   - Body should include:
     - 🔍 **Goal**: What this issue implements and why.
     - 📋 **Definition of Done**: What must be built for this to be complete.
     - ✅ **Acceptance Criteria**: Precise conditions for this issue to be marked as complete (e.g., tests, review).
     - 🧠 **Implementation Notes**: Include researched best practices using Perplexity MCP (e.g., data modeling strategies, API design, UX guidelines).
     - 🗂️ **Related Epics / Areas**: Link to relevant modules from the product vision (e.g., CRM, Tour Planning, Project Management).
4. Post the issues to GitHub in **sequential order**, beginning with the issue that should be implemented first. This is critical.

Use Perplexity MCP to research anything unclear, add recommendations to improve performance, scalability, or maintainability. The goal is to give developers crystal-clear guidance with high-quality issues that reflect real business logic.

Each issue must be implementation-ready and traceable back to the product vision. Prioritize correctness, clarity, and completeness.
