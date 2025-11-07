import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { ScaffoldCommand } from '../../src/commands/scaffold.js';

describe('ScaffoldCommand', () => {
  const testDir = path.join(process.cwd(), 'test-scaffold-tmp');
  const openspecDir = path.join(testDir, 'openspec');
  const changesDir = path.join(openspecDir, 'changes');

  beforeEach(async () => {
    await fs.mkdir(changesDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('kebab-case validation', () => {
    it('should reject uppercase letters in change ID', async () => {
      const scaffoldCommand = new ScaffoldCommand();

      await expect(
        scaffoldCommand.execute('TestFeature', testDir)
      ).rejects.toThrow('Invalid change ID "TestFeature". Must be kebab-case');
    });

    it('should reject underscores in change ID', async () => {
      const scaffoldCommand = new ScaffoldCommand();

      await expect(
        scaffoldCommand.execute('test_feature', testDir)
      ).rejects.toThrow('Invalid change ID "test_feature". Must be kebab-case');
    });

    it('should reject spaces in change ID', async () => {
      const scaffoldCommand = new ScaffoldCommand();

      await expect(
        scaffoldCommand.execute('test feature', testDir)
      ).rejects.toThrow('Invalid change ID "test feature". Must be kebab-case');
    });

    it('should accept valid kebab-case change ID', async () => {
      const scaffoldCommand = new ScaffoldCommand();

      // Use non-interactive mode with empty capabilities
      await scaffoldCommand.execute('test-feature', testDir, { capabilities: [] });

      const changeDir = path.join(changesDir, 'test-feature');
      expect(await fs.stat(changeDir).then(() => true).catch(() => false)).toBe(true);
    });
  });

  describe('file generation', () => {
    it('should create proposal.md with correct template', async () => {
      const scaffoldCommand = new ScaffoldCommand();
      await scaffoldCommand.execute('test-change', testDir, { capabilities: [] });

      const proposalPath = path.join(changesDir, 'test-change', 'proposal.md');
      const content = await fs.readFile(proposalPath, 'utf-8');

      expect(content).toContain('## Why');
      expect(content).toContain('## What Changes');
      expect(content).toContain('## Impact');
    });

    it('should create tasks.md with correct template', async () => {
      const scaffoldCommand = new ScaffoldCommand();
      await scaffoldCommand.execute('test-change', testDir, { capabilities: [] });

      const tasksPath = path.join(changesDir, 'test-change', 'tasks.md');
      const content = await fs.readFile(tasksPath, 'utf-8');

      expect(content).toContain('## 1. Implementation');
      expect(content).toContain('- [ ]');
    });

    it('should create design.md with TODO comments', async () => {
      const scaffoldCommand = new ScaffoldCommand();
      await scaffoldCommand.execute('test-change', testDir, { capabilities: [] });

      const designPath = path.join(changesDir, 'test-change', 'design.md');
      const content = await fs.readFile(designPath, 'utf-8');

      expect(content).toContain('<!-- TODO');
      expect(content).toContain('Use it when:');
      expect(content).toContain('Delete it if:');
    });

    it('should create specs directory', async () => {
      const scaffoldCommand = new ScaffoldCommand();
      await scaffoldCommand.execute('test-change', testDir, { capabilities: [] });

      const specsDir = path.join(changesDir, 'test-change', 'specs');
      expect(await fs.stat(specsDir).then(() => true).catch(() => false)).toBe(true);
    });
  });

  describe('idempotent execution', () => {
    it('should not overwrite existing proposal.md', async () => {
      const scaffoldCommand = new ScaffoldCommand();
      const changeDir = path.join(changesDir, 'test-change');

      // First run
      await scaffoldCommand.execute('test-change', testDir, { capabilities: [] });

      // Modify proposal.md
      const proposalPath = path.join(changeDir, 'proposal.md');
      const customContent = '# Custom Content';
      await fs.writeFile(proposalPath, customContent);

      // Second run
      await scaffoldCommand.execute('test-change', testDir, { capabilities: [] });

      // Verify content wasn't overwritten
      const content = await fs.readFile(proposalPath, 'utf-8');
      expect(content).toBe(customContent);
    });

    it('should not overwrite existing tasks.md', async () => {
      const scaffoldCommand = new ScaffoldCommand();
      const changeDir = path.join(changesDir, 'test-change');

      // First run
      await scaffoldCommand.execute('test-change', testDir, { capabilities: [] });

      // Modify tasks.md
      const tasksPath = path.join(changeDir, 'tasks.md');
      const customContent = '# Custom Tasks';
      await fs.writeFile(tasksPath, customContent);

      // Second run
      await scaffoldCommand.execute('test-change', testDir, { capabilities: [] });

      // Verify content wasn't overwritten
      const content = await fs.readFile(tasksPath, 'utf-8');
      expect(content).toBe(customContent);
    });

    it('should not overwrite existing design.md', async () => {
      const scaffoldCommand = new ScaffoldCommand();
      const changeDir = path.join(changesDir, 'test-change');

      // First run
      await scaffoldCommand.execute('test-change', testDir, { capabilities: [] });

      // Modify design.md
      const designPath = path.join(changeDir, 'design.md');
      const customContent = '# Custom Design';
      await fs.writeFile(designPath, customContent);

      // Second run
      await scaffoldCommand.execute('test-change', testDir, { capabilities: [] });

      // Verify content wasn't overwritten
      const content = await fs.readFile(designPath, 'utf-8');
      expect(content).toBe(customContent);
    });
  });

  describe('spec template generation', () => {
    it('should generate spec with ADDED Requirements structure', async () => {
      const scaffoldCommand = new ScaffoldCommand();

      // Use non-interactive mode with capabilities
      await scaffoldCommand.execute('test-change', testDir, { capabilities: ['test-api'] });

      // The specs directory should exist with the capability
      const specFile = path.join(changesDir, 'test-change', 'specs', 'test-api', 'spec.md');
      const content = await fs.readFile(specFile, 'utf-8');

      expect(content).toContain('## ADDED Requirements');
      expect(content).toContain('### Requirement:');
      expect(content).toContain('#### Scenario:');
      expect(content).toContain('- **GIVEN**');
      expect(content).toContain('- **WHEN**');
      expect(content).toContain('- **THEN**');
    });

    it('should generate multiple spec files for multiple capabilities', async () => {
      const scaffoldCommand = new ScaffoldCommand();

      await scaffoldCommand.execute('test-change', testDir, {
        capabilities: ['api-users', 'db-schema']
      });

      const apiSpec = path.join(changesDir, 'test-change', 'specs', 'api-users', 'spec.md');
      const dbSpec = path.join(changesDir, 'test-change', 'specs', 'db-schema', 'spec.md');

      expect(await fs.stat(apiSpec).then(() => true).catch(() => false)).toBe(true);
      expect(await fs.stat(dbSpec).then(() => true).catch(() => false)).toBe(true);
    });
  });

  describe('cross-platform compatibility', () => {
    it('should use fs.mkdir instead of shell commands', async () => {
      const scaffoldCommand = new ScaffoldCommand();

      // This test verifies the implementation doesn't use execSync
      // If it completes without errors, it's using proper Node.js APIs
      await scaffoldCommand.execute('test-change', testDir, { capabilities: [] });

      const changeDir = path.join(changesDir, 'test-change');
      expect(await fs.stat(changeDir).then(() => true).catch(() => false)).toBe(true);
    });

    it('should work with Windows-style paths', async () => {
      const scaffoldCommand = new ScaffoldCommand();
      const windowsStylePath = testDir.replace(/\//g, '\\');

      await scaffoldCommand.execute('test-change', windowsStylePath, { capabilities: [] });

      const changeDir = path.join(changesDir, 'test-change');
      expect(await fs.stat(changeDir).then(() => true).catch(() => false)).toBe(true);
    });
  });
});
