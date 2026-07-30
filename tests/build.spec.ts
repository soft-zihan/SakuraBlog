
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const filesJsonPath = path.join(publicDir, 'data', 'files.json');
const publicNotesDir = path.join(publicDir, 'notes');

describe('Build System & File Tree Generation', () => {
  
  // Run the script before tests
  beforeAll(() => {
    console.log('Running generate-tree.ts...');
    execSync('npx tsx scripts/generate-tree.ts', { stdio: 'inherit', env: { ...process.env, SKIP_GIT_LOG: 'true' } });
  }, 120000); // 120s timeout

  it('files.json should be generated', () => {
    expect(fs.existsSync(filesJsonPath)).toBe(true);
  });

  it('public/notes directory should exist (Fixes Article 404)', () => {
    // This verifies that the script copies notes to public/notes
    expect(fs.existsSync(publicNotesDir)).toBe(true);
    // Check if at least one language folder exists (assuming 'en' or 'zh' exists in notes)
    const notesContent = fs.readdirSync(publicNotesDir);
    expect(notesContent.length).toBeGreaterThan(0);
  });

  it('files.json should contain "Project Source Code" node', () => {
    const files = JSON.parse(fs.readFileSync(filesJsonPath, 'utf-8'));
    const sourceNode = files.find((n: any) => n.name === 'Project Source Code');
    expect(sourceNode).toBeDefined();
    expect(sourceNode.type).toBe('directory');
  });

  it('Source Code node should contain "src" folder (Correct Structure)', () => {
    const files = JSON.parse(fs.readFileSync(filesJsonPath, 'utf-8'));
    const sourceNode = files.find((n: any) => n.name === 'Project Source Code');
    
    const srcNode = sourceNode.children.find((n: any) => n.name === 'src');
    expect(srcNode).toBeDefined();
    expect(srcNode.type).toBe('directory');
    expect(srcNode.children.length).toBeGreaterThan(0);
  });

  it('Source Code node should contain root configuration files', () => {
    const files = JSON.parse(fs.readFileSync(filesJsonPath, 'utf-8'));
    const sourceNode = files.find((n: any) => n.name === 'Project Source Code');
    
    // Check for essential files that should always exist in root
    // Note: index.html is in src/ in this project structure
    const essentialFiles = ['package.json', 'tsconfig.json'];
    const presentFiles = sourceNode.children.map((n: any) => n.name);
    
    essentialFiles.forEach(file => {
        expect(presentFiles).toContain(file);
    });
  });

  it('Build system should adapt to new files in root', () => {
      // 1. Create a temporary file in root
      const tempFileName = 'test-dynamic-scan-' + Date.now() + '.md';
      const tempFilePath = path.join(rootDir, tempFileName);
      fs.writeFileSync(tempFilePath, '# Test Dynamic Scan');

      try {
          // 2. Run build script again
          console.log('Running generate-tree.ts with new file...');
          execSync('npx tsx scripts/generate-tree.ts', { stdio: 'inherit', env: { ...process.env, SKIP_GIT_LOG: 'true' } });

          // 3. Check if file appears in files.json
          const files = JSON.parse(fs.readFileSync(filesJsonPath, 'utf-8'));
          const sourceNode = files.find((n: any) => n.name === 'Project Source Code');
          const fileNode = sourceNode.children.find((n: any) => n.name === tempFileName);
          
          expect(fileNode).toBeDefined();
          expect(fileNode.path).toBe(tempFileName);
          
          // 4. Verify content fetchability
          const rawPath = path.join(publicDir, fileNode.fetchPath);
          expect(fs.existsSync(rawPath)).toBe(true);
      } finally {
          // Cleanup
          if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
          // Re-run build to restore clean state (optional but good practice)
          execSync('npx tsx scripts/generate-tree.ts', { stdio: 'ignore', env: { ...process.env, SKIP_GIT_LOG: 'true' } });
      }
  }, 120000); // 120s timeout
});
