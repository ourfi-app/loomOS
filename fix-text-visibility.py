#!/usr/bin/env python3
"""
Text Visibility Fixer for loomOS
Fixes hardcoded colors to use CSS variables for dark/light mode compatibility
"""

import os
import re
from pathlib import Path
from typing import List, Tuple

# Color mappings - map hardcoded colors to CSS variables
COLOR_MAPPINGS = {
    # Background colors
    '#ffffff': 'var(--webos-bg-primary)',
    '#FFFFFF': 'var(--webos-bg-primary)',
    'rgba(255, 255, 255': 'rgba(var(--webos-bg-primary-rgb)',
    '#000000': 'var(--webos-text-primary)',
    '#000': 'var(--webos-text-primary)',
    
    # Text colors - dark shades
    '#1a1a1a': 'var(--webos-text-primary)',
    '#2a2a2a': 'var(--webos-text-primary)',
    '#4a4a4a': 'var(--webos-text-secondary)',
    '#6a6a6a': 'var(--webos-text-tertiary)',
    '#8a8a8a': 'var(--webos-text-muted)',
    '#9a9a9a': 'var(--webos-text-muted)',
    
    # Surface/background colors
    '#f5f5f5': 'var(--webos-surface)',
    '#f8f8f8': 'var(--webos-surface)',
    '#e8e8e8': 'var(--webos-surface)',
    '#d8d8d8': 'var(--webos-bg-subtle)',
    
    # Border colors
    'rgba(0, 0, 0, 0.1)': 'var(--webos-border-light)',
    'rgba(0, 0, 0, 0.15)': 'var(--webos-border-medium)',
    'rgba(255, 255, 255, 0.1)': 'var(--webos-border-overlay)',
    'rgba(255, 255, 255, 0.2)': 'var(--webos-border-overlay)',
}

# Files to skip
SKIP_DIRS = {
    'node_modules',
    '.git',
    '.next',
    'dist',
    'build',
    '__pycache__',
}

SKIP_FILES = {
    'fix-text-visibility.py',
    'comprehensive_styling_audit.py',
    'comprehensive_styling_fix.py',
    'comprehensive_styling_fix_v2.py',
}


def should_process_file(filepath: Path) -> bool:
    """Check if file should be processed"""
    # Check if in skip directory
    for part in filepath.parts:
        if part in SKIP_DIRS:
            return False
    
    # Check if in skip files
    if filepath.name in SKIP_FILES:
        return False
    
    # Only process TypeScript/TSX files
    return filepath.suffix in {'.ts', '.tsx'}


def find_hardcoded_colors(content: str) -> List[Tuple[str, str, int]]:
    """Find hardcoded colors in content"""
    issues = []
    
    # Find hex colors
    hex_pattern = r'#[0-9A-Fa-f]{3,6}(?!["\'])'
    for match in re.finditer(hex_pattern, content):
        color = match.group()
        line_num = content[:match.start()].count('\n') + 1
        
        # Skip if it's a comment
        line_start = content.rfind('\n', 0, match.start()) + 1
        line = content[line_start:content.find('\n', match.start())]
        if '//' in line[:line.index(color)] or '/*' in line[:line.index(color)]:
            continue
        
        issues.append((color, 'hex', line_num))
    
    # Find rgba colors
    rgba_pattern = r'rgba?\([^)]+\)'
    for match in re.finditer(rgba_pattern, content):
        color = match.group()
        line_num = content[:match.start()].count('\n') + 1
        
        # Skip if it's a comment
        line_start = content.rfind('\n', 0, match.start()) + 1
        line = content[line_start:content.find('\n', match.start())]
        if '//' in line[:line.find(color)] if color in line else False:
            continue
        
        issues.append((color, 'rgba', line_num))
    
    return issues


def fix_content(content: str) -> Tuple[str, int]:
    """Fix hardcoded colors in content"""
    fixed_content = content
    changes = 0
    
    # Replace known color mappings
    for old_color, new_color in COLOR_MAPPINGS.items():
        if old_color in fixed_content:
            # Use regex to avoid replacing inside comments
            pattern = re.compile(re.escape(old_color) + r'(?!["\'])')
            matches = list(pattern.finditer(fixed_content))
            
            for match in reversed(matches):
                # Check if in comment
                line_start = fixed_content.rfind('\n', 0, match.start()) + 1
                line = fixed_content[line_start:fixed_content.find('\n', match.start())]
                if '//' not in line[:match.start() - line_start]:
                    fixed_content = fixed_content[:match.start()] + new_color + fixed_content[match.end():]
                    changes += 1
    
    return fixed_content, changes


def process_file(filepath: Path, dry_run: bool = False) -> Tuple[int, List[str]]:
    """Process a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find issues
        issues = find_hardcoded_colors(content)
        
        if not issues:
            return 0, []
        
        # Fix content
        fixed_content, changes = fix_content(content)
        
        # Write back if not dry run
        if not dry_run and changes > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
        
        issue_messages = []
        for color, color_type, line_num in issues[:10]:  # Limit to 10 issues per file
            issue_messages.append(f"  Line {line_num}: {color} ({color_type})")
        
        if len(issues) > 10:
            issue_messages.append(f"  ... and {len(issues) - 10} more")
        
        return changes, issue_messages
    
    except Exception as e:
        return 0, [f"  Error: {str(e)}"]


def main():
    """Main function"""
    import sys
    
    dry_run = '--dry-run' in sys.argv or '-n' in sys.argv
    
    print("=" * 80)
    print("loomOS Text Visibility Fixer")
    print("=" * 80)
    print()
    
    if dry_run:
        print("🔍 DRY RUN MODE - No files will be modified\n")
    
    root_dir = Path('.')
    total_files = 0
    total_changes = 0
    files_with_issues = []
    
    print("Scanning files...")
    print()
    
    # Find all TypeScript files
    for filepath in root_dir.rglob('*.ts*'):
        if not should_process_file(filepath):
            continue
        
        total_files += 1
        changes, issues = process_file(filepath, dry_run)
        
        if changes > 0 or issues:
            total_changes += changes
            files_with_issues.append((filepath, changes, issues))
            
            status = "🔍 Found" if dry_run else "✅ Fixed"
            print(f"{status} {changes} issue(s) in {filepath}")
            for issue in issues[:5]:  # Show first 5 issues
                print(issue)
            print()
    
    print("=" * 80)
    print("Summary")
    print("=" * 80)
    print(f"Files scanned: {total_files}")
    print(f"Files with issues: {len(files_with_issues)}")
    print(f"Total changes: {total_changes}")
    print()
    
    if dry_run:
        print("Run without --dry-run to apply fixes")
    else:
        print("✨ All fixes applied!")
    print()


if __name__ == '__main__':
    main()
