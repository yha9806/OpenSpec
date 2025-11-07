## ADDED Requirements
### Requirement: Cross-Platform Test Utilities
Test files SHALL use Node.js filesystem APIs instead of platform-specific shell commands to ensure compatibility across Windows, macOS, and Linux.

#### Scenario: Creating directories in tests
- **GIVEN** a test needs to create a directory structure
- **WHEN** the test runs on Windows, macOS, or Linux
- **THEN** the directory SHALL be created using `fs.mkdir(path, { recursive: true })`
- **AND** NOT use shell commands like `mkdir -p` or `md`
- **AND** the test SHALL pass on all platforms

#### Scenario: Writing files in tests
- **GIVEN** a test needs to create a file with specific content
- **WHEN** the test runs on any platform
- **THEN** the file SHALL be written using `fs.writeFile(path, content)`
- **AND** NOT use shell commands like `cat > file <<EOF` or `echo > file`
- **AND** the test SHALL pass on all platforms

#### Scenario: Reading files in tests
- **GIVEN** a test needs to read file contents
- **WHEN** the test runs on any platform
- **THEN** the file SHALL be read using `fs.readFile(path, 'utf-8')`
- **AND** NOT use shell commands like `cat file` or `type file`
- **AND** the test SHALL pass on all platforms

### Requirement: Windows Test Suite Compatibility
All tests SHALL pass on Windows environments without platform-specific failures.

#### Scenario: Running full test suite on Windows
- **GIVEN** a Windows development environment with Node.js installed
- **WHEN** the command `pnpm test` is executed
- **THEN** all 270 tests SHALL pass
- **AND** no tests SHALL fail due to Unix-specific shell commands
- **AND** the test output SHALL match the expected results from Unix/Mac platforms
