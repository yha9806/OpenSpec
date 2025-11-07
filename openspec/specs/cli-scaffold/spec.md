# cli-scaffold Specification

## Purpose
TBD - created by archiving change add-scaffold-command. Update Purpose after archive.
## Requirements
### Requirement: Scaffolding Command Registration
The CLI SHALL expose an `openspec scaffold <change-id>` command that validates the change identifier before generating files.

#### Scenario: Registering scaffold command
- **WHEN** a user runs `openspec scaffold add-user-notifications`
- **THEN** the CLI SHALL reject invalid identifiers (non kebab-case) before proceeding
- **AND** display usage documentation via `openspec scaffold --help`
- **AND** exit with code 0 after successful scaffolding

### Requirement: Change Directory Structure
The scaffold command SHALL create the standard change workspace with proposal, tasks, design, and delta directories laid out according to OpenSpec conventions.

#### Scenario: Generating change workspace
- **WHEN** scaffolding a new change with id `add-user-notifications`
- **THEN** create `openspec/changes/add-user-notifications/`
- **AND** generate `proposal.md` and `tasks.md` with OpenSpec-compliant templates
- **AND** always generate `design.md` with TODO comments explaining when to use it and when to delete it
- **AND** create `openspec/changes/add-user-notifications/specs/` ready for capability-specific deltas

### Requirement: Template Content Guidance
The scaffold command SHALL populate generated Markdown files with OpenSpec-compliant templates so authors can copy, edit, and pass validation without reformatting.

#### Scenario: Populating proposal and tasks templates
- **WHEN** the scaffold command writes `proposal.md`
- **THEN** include the `## Why`, `## What Changes`, and `## Impact` headings with placeholder guidance text
- **AND** ensure `tasks.md` starts with `## 1. Implementation` and numbered checklist items using `- [ ]` syntax
- **AND** annotate optional sections (like `design.md`) with inline TODO comments so users understand when to keep or delete them

### Requirement: Interactive Capability Input
The scaffold command SHALL prompt the user interactively to specify capability names for spec deltas, allowing dynamic customization based on the change scope.

#### Scenario: Prompting for capability names
- **GIVEN** the user has run `openspec scaffold add-user-notifications`
- **WHEN** the command prompts for capability input
- **THEN** display an interactive prompt asking "Enter capability names (comma-separated, or press Enter to skip):"
- **AND** accept multiple capability names separated by commas (e.g., "api-notifications, ui-alerts")
- **AND** validate each capability name follows kebab-case format
- **AND** allow the user to skip by pressing Enter, which creates no spec deltas

### Requirement: Delta Spec Creation
The scaffold command SHALL create capability delta files with correctly formatted requirement and scenario placeholders that guide authors to enter the actual behavior.

#### Scenario: Creating spec delta skeleton
- **WHEN** the user provides capability names `api-notifications, ui-alerts`
- **THEN** generate `openspec/changes/add-user-notifications/specs/api-notifications/spec.md`
- **AND** generate `openspec/changes/add-user-notifications/specs/ui-alerts/spec.md`
- **AND** each spec file SHALL include `## ADDED Requirements` with placeholder `### Requirement:` blocks
- **AND** each requirement SHALL have a matching `#### Scenario:` with GIVEN/WHEN/THEN template
- **AND** include inline comments reminding authors to replace placeholder text
- **AND** ensure the generated delta passes `openspec validate add-user-notifications --strict` before user edits

### Requirement: Idempotent Execution
The scaffold command SHALL be safe to rerun, preserving user edits while filling in any missing managed sections.

#### Scenario: Rerunning scaffold on existing change
- **WHEN** the command is executed again for an existing change directory containing user-edited files
- **THEN** leave existing content untouched except for managed placeholder regions or missing files that need creation
- **AND** update the filesystem summary to highlight which files were skipped, created, or refreshed

