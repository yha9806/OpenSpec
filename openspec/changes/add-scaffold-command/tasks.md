## 1. CLI scaffolding command
- [x] 1.1 Register an `openspec scaffold <change-id>` command in the CLI entrypoint with kebab-case validation.
- [x] 1.2 Implement interactive capability name prompt using inquirer (comma-separated input, kebab-case validation).
- [x] 1.3 Implement generator logic that creates change directory structure with `proposal.md`, `tasks.md`, `design.md` (with TODO comments).
- [x] 1.4 Generate spec delta templates dynamically based on user-provided capability names.
- [x] 1.5 Ensure idempotent execution: skip existing files, only create missing ones, show operation summary.

## 2. Template system
- [x] 2.1 Create `scaffold-proposal-template.ts` with Why/What/Impact structure.
- [x] 2.2 Create `scaffold-tasks-template.ts` with checklist format.
- [x] 2.3 Create `scaffold-design-template.ts` with TODO comments explaining usage.
- [x] 2.4 Create `scaffold-spec-template.ts` with ADDED Requirements + GIVEN/WHEN/THEN scenario placeholders.

## 3. Test coverage
- [x] 3.1 Add unit tests covering kebab-case validation for change-id and capability names.
- [x] 3.2 Add test for interactive prompt with comma-separated input.
- [x] 3.3 Add test for file generation with multiple capabilities.
- [x] 3.4 Add test for idempotent execution (existing files not overwritten).
- [x] 3.5 Add integration test ensuring generated deltas pass `openspec validate --strict`.

## 4. Documentation
- [ ] 4.1 Update `openspec/AGENTS.md` with scaffold command usage examples.
- [ ] 4.2 Update README to mention scaffold workflow.
