import path from 'path';
import { input } from '@inquirer/prompts';
import ora from 'ora';
import chalk from 'chalk';
import { FileSystemUtils } from '../utils/file-system.js';
import { scaffoldProposalTemplate } from '../core/templates/scaffold-proposal-template.js';
import { scaffoldTasksTemplate } from '../core/templates/scaffold-tasks-template.js';
import { scaffoldDesignTemplate } from '../core/templates/scaffold-design-template.js';
const OPENSPEC_DIR = 'openspec';
const CHANGES_DIR = 'changes';
export class ScaffoldCommand {
    validateChangeId(changeId) {
        const kebabCaseRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!kebabCaseRegex.test(changeId)) {
            throw new Error(`Invalid change ID "${changeId}". Must be kebab-case (lowercase letters, numbers, and hyphens only).`);
        }
    }
    validateCapabilityName(capability) {
        const kebabCaseRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!kebabCaseRegex.test(capability)) {
            throw new Error(`Invalid capability name "${capability}". Must be kebab-case (lowercase letters, numbers, and hyphens only).`);
        }
    }
    parseCapabilityNames(input) {
        if (!input || input.trim() === '') {
            return [];
        }
        return input
            .split(',')
            .map(name => name.trim())
            .filter(name => name.length > 0);
    }
    async execute(changeId, projectPath = '.', options) {
        const spinner = ora();
        try {
            // Step 1: Validate change ID
            this.validateChangeId(changeId);
            const changeBasePath = path.join(projectPath, OPENSPEC_DIR, CHANGES_DIR, changeId);
            // Check if change already exists
            const changeExists = await FileSystemUtils.directoryExists(changeBasePath);
            if (changeExists) {
                spinner.warn(chalk.yellow(`Change "${changeId}" already exists. Running in idempotent mode.`));
            }
            // Step 2: Get capability names (interactive or from options)
            let capabilityNames;
            if (options?.capabilities) {
                // Non-interactive mode for testing
                capabilityNames = options.capabilities;
            }
            else {
                // Interactive mode
                const capabilitiesInput = await input({
                    message: 'Enter capability names (comma-separated, or press Enter to skip):',
                    default: '',
                });
                capabilityNames = this.parseCapabilityNames(capabilitiesInput);
            }
            // Validate all capability names
            for (const capability of capabilityNames) {
                this.validateCapabilityName(capability);
            }
            // Step 3: Create directory structure
            spinner.start('Creating change directory structure...');
            await FileSystemUtils.createDirectory(changeBasePath);
            const specsPath = path.join(changeBasePath, 'specs');
            await FileSystemUtils.createDirectory(specsPath);
            spinner.succeed('Created change directory structure');
            // Step 4: Generate template files (idempotent)
            const filesCreated = [];
            const filesSkipped = [];
            // Generate proposal.md
            const proposalPath = path.join(changeBasePath, 'proposal.md');
            if (await FileSystemUtils.fileExists(proposalPath)) {
                filesSkipped.push('proposal.md');
            }
            else {
                await FileSystemUtils.writeFile(proposalPath, scaffoldProposalTemplate());
                filesCreated.push('proposal.md');
            }
            // Generate tasks.md
            const tasksPath = path.join(changeBasePath, 'tasks.md');
            if (await FileSystemUtils.fileExists(tasksPath)) {
                filesSkipped.push('tasks.md');
            }
            else {
                await FileSystemUtils.writeFile(tasksPath, scaffoldTasksTemplate());
                filesCreated.push('tasks.md');
            }
            // Generate design.md (always)
            const designPath = path.join(changeBasePath, 'design.md');
            if (await FileSystemUtils.fileExists(designPath)) {
                filesSkipped.push('design.md');
            }
            else {
                await FileSystemUtils.writeFile(designPath, scaffoldDesignTemplate());
                filesCreated.push('design.md');
            }
            // Step 5: Generate spec deltas for each capability
            for (const capability of capabilityNames) {
                const capabilitySpecPath = path.join(specsPath, capability);
                await FileSystemUtils.createDirectory(capabilitySpecPath);
                const specFilePath = path.join(capabilitySpecPath, 'spec.md');
                if (await FileSystemUtils.fileExists(specFilePath)) {
                    filesSkipped.push(`specs/${capability}/spec.md`);
                }
                else {
                    const specTemplate = this.generateSpecTemplate(capability);
                    await FileSystemUtils.writeFile(specFilePath, specTemplate);
                    filesCreated.push(`specs/${capability}/spec.md`);
                }
            }
            // Step 6: Display summary
            console.log();
            spinner.succeed(chalk.green(`Scaffolded change: ${chalk.bold(changeId)}`));
            console.log();
            if (filesCreated.length > 0) {
                console.log(chalk.blue('  Files created:'));
                filesCreated.forEach(file => console.log(`    ${chalk.gray('✓')} ${file}`));
            }
            if (filesSkipped.length > 0) {
                console.log(chalk.yellow('  Files skipped (already exist):'));
                filesSkipped.forEach(file => console.log(`    ${chalk.gray('↷')} ${file}`));
            }
            if (capabilityNames.length === 0) {
                console.log();
                console.log(chalk.gray('  No spec deltas created. You can add them manually to specs/ later.'));
            }
            console.log();
            console.log(chalk.gray('  Next steps:'));
            console.log(chalk.gray(`    1. Edit ${changeId}/proposal.md to describe your change`));
            console.log(chalk.gray(`    2. Break down work in ${changeId}/tasks.md`));
            console.log(chalk.gray(`    3. Run: openspec validate ${changeId} --strict`));
            console.log();
        }
        catch (error) {
            spinner.fail(chalk.red('Scaffolding failed'));
            throw error;
        }
    }
    generateSpecTemplate(capability) {
        return `## ADDED Requirements
### Requirement: [Name of Requirement]
<!-- Describe what the system SHALL do. Replace this placeholder with actual requirement text. -->
The system SHALL [describe the behavior or capability].

#### Scenario: [Scenario name]
<!-- Describe a specific scenario that validates this requirement.
     Use GIVEN/WHEN/THEN format for clarity. -->

- **GIVEN** [preconditions or initial state]
- **WHEN** [action or event occurs]
- **THEN** [expected outcome or system behavior]
- **AND** [additional expected outcomes, if any]

<!-- You can add more scenarios by copying the template above.
     Each requirement should have at least one scenario. -->
`;
    }
}
//# sourceMappingURL=scaffold.js.map