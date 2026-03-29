---
description: Update the global project context after every chat or interaction
---

## Objective
To ensure that all future agents have access to the latest project state, you MUST perform this workflow after every significant interaction or before ending your turn.

## Context File Location
`C:\Users\Administrator\WorkPlace\website builder saas\buildersaas\.agents\PROJECT_CONTEXT.md`

## Steps
1. Before finishing your current task or chat session, use the write_to_file or replace_file_content tools to modify the `PROJECT_CONTEXT.md` file located in `C:\Users\Administrator\WorkPlace\website builder saas\buildersaas\.agents\`.
2. Review the file and update it with the following information:
   - Expand or add to the current objectives and what was just achieved in this session.
   - Any new templates added from `connect` and their status (success, bugs, etc.).
   - The current architectural state, known bugs, or action items going forward.
3. Keep the file concise but highly informative, so the next agent can grasp the entire history and goals immediately simply by reading this file.
