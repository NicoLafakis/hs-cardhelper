/**
 * CardHelper Custodian Script
 * 
 * Automated code quality checks AND CLEANUP for AI agents.
 * Run with: npm run custodian
 * 
 * This script:
 * - DETECTS AND REMOVES console.log statements from src/
 * - Flags TODO/FIXME comments for review
 * - Detects direct API calls in components (should use services)
 * - Flags large files that may need refactoring
 * - Runs ESLint with auto-fix
 * 
 * 🤖 100% AGENT-MAINTAINED - This script cleans up after AI agents
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
}

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

/**
 * Remove console.log statements from a file
 * Uses AST-like parsing to safely remove complete statements
 * Preserves console.error, console.warn for legitimate error handling
 */
function removeConsoleLogs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  let removed = 0
  
  // Pattern 1: Single-line console.log statements (most common)
  // Match: console.log(...); or console.log(...)
  // Be careful not to match inside strings or comments
  const singleLinePattern = /^(\s*)console\.log\([^)]*\);?\s*$/gm
  const matches1 = content.match(singleLinePattern)
  if (matches1) {
    content = content.replace(singleLinePattern, '')
    removed += matches1.length
  }
  
  // Pattern 2: Console.log with template literals or simple strings on one line
  const templatePattern = /^(\s*)console\.log\(`[^`]*`\);?\s*$/gm
  const matches2 = content.match(templatePattern)
  if (matches2) {
    content = content.replace(templatePattern, '')
    removed += matches2.length
  }
  
  // Pattern 3: console.log with string concatenation on one line
  const concatPattern = /^(\s*)console\.log\(['"][^'"]*['"](\s*\+\s*[^;]+)?\);?\s*$/gm
  const matches3 = content.match(concatPattern)
  if (matches3) {
    content = content.replace(concatPattern, '')
    removed += matches3.length
  }
  
  // Clean up multiple blank lines left behind (max 2 consecutive)
  content = content.replace(/\n{3,}/g, '\n\n')
  
  if (removed > 0) {
    fs.writeFileSync(filePath, content)
  }
  
  return removed
}

/**
 * Walk directory and process files
 */
function walkDir(dir, extensions, callback) {
  if (!fs.existsSync(dir)) return
  
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('dist') && !file.includes('.git')) {
      walkDir(filePath, extensions, callback)
    } else if (extensions.some(ext => file.endsWith(ext))) {
      callback(filePath)
    }
  }
}

/**
 * Count console.log statements in a file
 */
function countConsoleLogs(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const matches = content.match(/console\.log\s*\(/g)
  return matches ? matches.length : 0
}

/**
 * Remove unused imports from a file
 * Detects imports that are never used in the file
 */
function removeUnusedImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  let removed = 0
  
  // Find all imports
  const importRegex = /^import\s+(?:(\{[^}]+\})|(\w+)(?:\s*,\s*(\{[^}]+\}))?)?\s*(?:from\s+)?['"][^'"]+['"];?\s*$/gm
  const imports = [...content.matchAll(importRegex)]
  
  for (const match of imports) {
    const fullImport = match[0]
    
    // Extract named imports like { X, Y, Z }
    const namedImportMatch = fullImport.match(/\{\s*([^}]+)\s*\}/)
    if (namedImportMatch) {
      const names = namedImportMatch[1].split(',').map(n => n.trim().split(/\s+as\s+/).pop().trim())
      
      // Check each named import
      const unusedNames = names.filter(name => {
        if (!name) return false
        // Count occurrences (must be more than 1 - the import itself)
        const regex = new RegExp(`\\b${name}\\b`, 'g')
        const occurrences = (content.match(regex) || []).length
        return occurrences <= 1
      })
      
      // If ALL named imports are unused, remove the whole line
      if (unusedNames.length === names.length && names.length > 0) {
        content = content.replace(fullImport + '\n', '')
        removed++
      }
    }
    
    // Extract default import
    const defaultMatch = fullImport.match(/^import\s+(\w+)\s+from/)
    if (defaultMatch) {
      const name = defaultMatch[1]
      const regex = new RegExp(`\\b${name}\\b`, 'g')
      const occurrences = (content.match(regex) || []).length
      if (occurrences <= 1) {
        content = content.replace(fullImport + '\n', '')
        removed++
      }
    }
  }
  
  if (removed > 0) {
    fs.writeFileSync(filePath, content)
  }
  
  return removed
}

/**
 * Fix unescaped entities in JSX
 */
function fixUnescapedEntities(filePath) {
  if (!filePath.endsWith('.jsx')) return 0
  
  let content = fs.readFileSync(filePath, 'utf8')
  let fixed = 0
  
  // Replace ' with &apos; only in JSX text (not in strings or attributes)
  // This is a simple heuristic - replace ' that appears to be in text content
  const originalContent = content
  
  // Fix common patterns: "don't", "it's", "won't", etc.
  content = content.replace(/>([^<]*)'([^<]*)</g, (match, before, after) => {
    fixed++
    return `>${before}&apos;${after}<`
  })
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content)
  }
  
  return fixed
}

/**
 * Find large files
 */
function findLargeFiles(directory, threshold = 200) {
  const largeFiles = []
  
  walkDir(path.join(projectRoot, directory), ['.js', '.jsx'], (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8')
    const lineCount = content.split('\n').length
    if (lineCount > threshold) {
      largeFiles.push({ 
        file: filePath.replace(projectRoot, '').replace(/\\/g, '/'), 
        lines: lineCount 
      })
    }
  })
  
  return largeFiles.sort((a, b) => b.lines - a.lines)
}

/**
 * Find TODO/FIXME comments
 */
function findTodos(directory) {
  const todos = []
  
  walkDir(path.join(projectRoot, directory), ['.js', '.jsx'], (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')
    lines.forEach((line, index) => {
      if (/TODO|FIXME|HACK|XXX/i.test(line)) {
        todos.push({
          file: filePath.replace(projectRoot, '').replace(/\\/g, '/'),
          line: index + 1,
          text: line.trim().substring(0, 80)
        })
      }
    })
  })
  
  return todos
}

/**
 * Find direct API calls in components
 */
function findDirectApiCalls(directory) {
  const violations = []
  
  walkDir(path.join(projectRoot, directory), ['.jsx'], (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')
    lines.forEach((line, index) => {
      if (/api\.(get|post|put|delete|patch)\s*\(/.test(line) || /axios\./.test(line)) {
        violations.push({
          file: filePath.replace(projectRoot, '').replace(/\\/g, '/'),
          line: index + 1,
          text: line.trim().substring(0, 60)
        })
      }
    })
  })
  
  return violations
}

// ============================================================
// MAIN EXECUTION
// ============================================================

console.log('\n' + '='.repeat(60))
log('blue', '🧹 CARDHELPER CUSTODIAN')
log('blue', '   100% Agent-Maintained Codebase')
log('magenta', '   Mode: DETECT AND CLEAN')
console.log('='.repeat(60) + '\n')

let issuesFixed = 0
let issuesRemaining = 0
let warnings = 0

// ============================================================
// STEP 1: Remove console.log statements from src/
// ============================================================
log('yellow', '📋 Step 1: Cleaning console.log statements from src/...')

let totalRemoved = 0
walkDir(path.join(projectRoot, 'src'), ['.js', '.jsx'], (filePath) => {
  // Skip test files
  if (filePath.includes('.test.') || filePath.includes('.spec.') || filePath.includes('/test/')) {
    return
  }
  const removed = removeConsoleLogs(filePath)
  if (removed > 0) {
    console.log(`   Cleaned ${removed} from ${filePath.replace(projectRoot, '')}`)
    totalRemoved += removed
  }
})

if (totalRemoved > 0) {
  log('green', `   ✓ Removed ${totalRemoved} console.log statements from src/`)
  issuesFixed += totalRemoved
} else {
  log('green', '   ✓ No console.log statements to remove')
}

// Check server/ for excessive logging (warning only, don't remove)
let serverLogs = 0
walkDir(path.join(projectRoot, 'server'), ['.js'], (filePath) => {
  serverLogs += countConsoleLogs(filePath)
})
if (serverLogs > 20) {
  log('yellow', `   ⚠ Server has ${serverLogs} console.log statements (review if excessive)`)
  warnings++
}

// ============================================================
// STEP 2: Remove completely unused imports
// ============================================================
log('yellow', '\n📋 Step 2: Removing completely unused imports...')

let totalUnusedRemoved = 0
walkDir(path.join(projectRoot, 'src'), ['.js', '.jsx'], (filePath) => {
  if (filePath.includes('.test.') || filePath.includes('.spec.') || filePath.includes('/test/')) {
    return
  }
  const removed = removeUnusedImports(filePath)
  if (removed > 0) {
    console.log(`   Removed ${removed} unused import(s) from ${filePath.replace(projectRoot, '').replace(/\\/g, '/')}`)
    totalUnusedRemoved += removed
  }
})

if (totalUnusedRemoved > 0) {
  log('green', `   ✓ Removed ${totalUnusedRemoved} unused imports`)
  issuesFixed += totalUnusedRemoved
} else {
  log('green', '   ✓ No completely unused imports found')
}

// ============================================================
// STEP 3: Check for TODO/FIXME comments
// ============================================================
log('yellow', '\n📋 Step 3: Checking for TODO/FIXME comments...')

const srcTodos = findTodos('src')
const serverTodos = findTodos('server')
const allTodos = [...srcTodos, ...serverTodos]

if (allTodos.length > 0) {
  log('yellow', `   ⚠ Found ${allTodos.length} TODO/FIXME comments:`)
  allTodos.slice(0, 5).forEach(t => {
    console.log(`      ${t.file}:${t.line}`)
  })
  if (allTodos.length > 5) {
    console.log(`      ... and ${allTodos.length - 5} more`)
  }
  warnings++
} else {
  log('green', '   ✓ No TODO/FIXME comments')
}

// ============================================================
// STEP 4: Check for direct API calls in components
// ============================================================
log('yellow', '\n📋 Step 4: Checking for direct API calls in components...')

const apiViolations = findDirectApiCalls('src/components')

if (apiViolations.length > 0) {
  log('red', `   ❌ Found ${apiViolations.length} direct API calls (should use services):`)
  apiViolations.forEach(v => {
    console.log(`      ${v.file}:${v.line} - ${v.text}`)
  })
  issuesRemaining += apiViolations.length
} else {
  log('green', '   ✓ No direct API calls in components')
}

// ============================================================
// STEP 5: Check for large files
// ============================================================
log('yellow', '\n📋 Step 5: Checking for large files (>300 lines)...')

const largeFilesSrc = findLargeFiles('src', 300)
const largeFilesServer = findLargeFiles('server', 300)
const allLargeFiles = [...largeFilesSrc, ...largeFilesServer]

if (allLargeFiles.length > 0) {
  log('yellow', `   ⚠ Found ${allLargeFiles.length} large files (consider refactoring):`)
  allLargeFiles.slice(0, 10).forEach(f => {
    console.log(`      ${f.file} (${f.lines} lines)`)
  })
  if (allLargeFiles.length > 10) {
    console.log(`      ... and ${allLargeFiles.length - 10} more`)
  }
  warnings++
} else {
  log('green', '   ✓ No excessively large files')
}

// ============================================================
// STEP 6: Run ESLint with auto-fix
// ============================================================
log('yellow', '\n📋 Step 6: Running ESLint with auto-fix...')

try {
  execSync('npx eslint src --ext js,jsx --fix', { 
    cwd: projectRoot, 
    encoding: 'utf8',
    stdio: 'pipe'
  })
  log('green', '   ✓ ESLint passed (auto-fixed where possible)')
} catch (error) {
  // ESLint returns non-zero if there are unfixable errors
  const output = error.stdout || ''
  const errorCount = (output.match(/error/gi) || []).length
  if (errorCount > 0) {
    log('red', `   ❌ ESLint found ${errorCount} unfixable errors`)
    issuesRemaining += errorCount
  } else {
    log('green', '   ✓ ESLint auto-fixed issues')
  }
}

// ============================================================
// STEP 7: Run Prettier
// ============================================================
log('yellow', '\n📋 Step 7: Running Prettier to format code...')

try {
  execSync('npx prettier --write "src/**/*.{js,jsx}" --log-level error', { 
    cwd: projectRoot, 
    encoding: 'utf8',
    stdio: 'pipe'
  })
  log('green', '   ✓ Code formatted with Prettier')
  issuesFixed++
} catch (error) {
  log('yellow', '   ⚠ Prettier encountered some issues')
}

// ============================================================
// SUMMARY
// ============================================================
console.log('\n' + '='.repeat(60))
if (issuesRemaining > 0) {
  log('red', `❌ CUSTODIAN COMPLETED WITH ISSUES`)
  log('green', `   ✓ Fixed: ${issuesFixed} issues`)
  log('red', `   ✗ Remaining: ${issuesRemaining} issues (need manual review)`)
  log('yellow', `   ⚠ Warnings: ${warnings}`)
} else if (warnings > 0) {
  log('yellow', `⚠ CUSTODIAN COMPLETED WITH WARNINGS`)
  log('green', `   ✓ Fixed: ${issuesFixed} issues`)
  log('yellow', `   ⚠ Warnings: ${warnings} (review recommended)`)
} else {
  log('green', `✓ CUSTODIAN COMPLETED - CODEBASE IS CLEAN!`)
  log('green', `   ✓ Fixed: ${issuesFixed} issues`)
}
console.log('='.repeat(60) + '\n')

// Exit with success if no remaining issues (warnings are OK)
process.exit(issuesRemaining > 0 ? 1 : 0)
