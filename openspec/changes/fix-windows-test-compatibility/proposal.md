## Why
Two test files use Unix-specific shell commands (`mkdir -p`, `bash -lc cat`, `cat`) via `execSync`, causing test failures on Windows platforms. This prevents Windows developers from running the full test suite and contributes to platform-specific CI failures.

Specific failures:
- `test/commands/validate.enriched-output.test.ts:25` - Uses `mkdir -p` which Windows cmd doesn't recognize
- `test/commands/validate.enriched-output.test.ts:26` - Uses Bash heredoc syntax unavailable on Windows
- `test/commands/spec.test.ts:67` - Uses `cat` command not available on Windows

Error: `Command failed: mkdir -p [path]` with Chinese error message indicating Windows incompatibility.

## What Changes
- Replace `execSync('mkdir -p ...')` with `fs.mkdir(..., { recursive: true })` in validate.enriched-output.test.ts
- Replace `execSync('bash -lc "cat > file <<EOF"')` with `fs.writeFile()` in validate.enriched-output.test.ts
- Replace `execSync('cat file')` with `fs.readFile()` in spec.test.ts
- Ensure all test utilities use cross-platform Node.js APIs instead of shell commands

## Impact
- Affected specs: `specs/test-infrastructure`
- Affected code: `test/commands/validate.enriched-output.test.ts`, `test/commands/spec.test.ts`
- Breaking changes: None (test-only changes)
- Migration steps: None
- Benefit: Windows developers can run full test suite (270 tests pass instead of 269/270)
