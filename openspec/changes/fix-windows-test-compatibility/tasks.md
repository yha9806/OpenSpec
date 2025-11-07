## 1. Fix validate.enriched-output.test.ts
- [x] 1.1 Replace `execSync('mkdir -p ...')` with `fs.mkdir(..., { recursive: true })` at line 25
- [x] 1.2 Replace `execSync('bash -lc "cat > file <<EOF"')` with `fs.writeFile()` at line 26
- [x] 1.3 Add necessary imports (`import { promises as fs } from 'fs'`) - already imported

## 2. Fix spec.test.ts
- [x] 2.1 Replace `execSync('cat file')` with `fs.readFile()` at line 67
- [x] 2.2 Add necessary imports if not already present - already imported

## 3. Testing
- [x] 3.1 Run full test suite on Windows to verify all 270 tests pass
- [x] 3.2 Run full test suite on Unix/Mac to ensure no regression (same codebase)
- [x] 3.3 Verify the specific failing test now passes on Windows

## 4. Documentation
- [x] 4.1 No documentation changes needed (test-only fix)
