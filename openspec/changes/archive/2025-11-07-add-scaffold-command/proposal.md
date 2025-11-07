## Why
Manual setup for new changes leads to formatting mistakes in spec deltas and slows agents who must recreate the same file skeletons for every proposal. A built-in scaffold command will generate compliant templates so assistants can focus on the change content instead of structure.

## What Changes
- Add an `openspec scaffold <change-id>` CLI command that creates a change directory with validated `proposal.md`, `tasks.md`, and spec delta templates.
- Update CLI documentation and quick-reference guidance so agents discover the scaffold workflow before drafting files manually.
- Add automated coverage (unit/integ tests) to ensure the command respects existing naming rules and generated Markdown passes validation.

## Impact
- Affected specs: `specs/cli-scaffold`
- Affected code: `src/cli/index.ts`, `src/commands`, `docs/`
