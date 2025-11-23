#!/usr/bin/env python3
"""
Script to replace hardcoded colors with design tokens.
Handles the 357 instances of hardcoded colors identified in the audit.
"""

import os
import re
from pathlib import Path
from typing import List, Tuple

# Color replacements: (pattern, replacement, description)
REPLACEMENTS: List[Tuple[str, str, str]] = [
    # PRIMARY BRAND COLORS (loomOS Orange)
    (r'#F18825', "var(--semantic-primary)", "loomOS Orange"),
    (r'#f18825', "var(--semantic-primary)", "loomOS Orange (lowercase)"),
    (r'#E07515', "var(--semantic-primary-dark)", "loomOS Orange Dark"),
    (r'#e07515', "var(--semantic-primary-dark)", "loomOS Orange Dark (lowercase)"),
    (r'#d17620', "var(--semantic-primary-dark)", "loomOS Orange Dark"),
    
    # SECONDARY/ACCENT COLORS (Trust Blue)
    (r'#2B8ED9', "var(--semantic-accent)", "Trust Blue"),
    (r'#2b8ed9', "var(--semantic-accent)", "Trust Blue (lowercase)"),
    (r'#1474B8', "var(--semantic-accent-dark)", "Trust Blue Dark"),
    (r'#1474b8', "var(--semantic-accent-dark)", "Trust Blue Dark (lowercase)"),
    
    # TEXT COLORS
    (r'#4a4a4a', "var(--semantic-text-primary)", "Dark gray text"),
    (r'#4A4A4A', "var(--semantic-text-primary)", "Dark gray text (uppercase)"),
    (r'#8a8a8a', "var(--semantic-text-tertiary)", "Medium gray text"),
    (r'#8A8A8A', "var(--semantic-text-tertiary)", "Medium gray text (uppercase)"),
    (r'#6a6a6a', "var(--semantic-text-secondary)", "Gray text"),
    (r'#6A6A6A', "var(--semantic-text-secondary)", "Gray text (uppercase)"),
    (r'#9a9a9a', "var(--semantic-text-muted)", "Muted gray text"),
    (r'#9A9A9A', "var(--semantic-text-muted)", "Muted gray text (uppercase)"),
    
    # BACKGROUND COLORS
    (r'#f5f5f5', "var(--semantic-surface-base)", "Light background"),
    (r'#F5F5F5', "var(--semantic-surface-base)", "Light background (uppercase)"),
    (r'#e8e8e8', "var(--semantic-bg-subtle)", "Subtle background"),
    (r'#E8E8E8', "var(--semantic-bg-subtle)", "Subtle background (uppercase)"),
    (r'#d8d8d8', "var(--semantic-bg-muted)", "Muted background"),
    (r'#D8D8D8', "var(--semantic-bg-muted)", "Muted background (uppercase)"),
    
    # GLASSMORPHISM
    (r'rgba\(255,\s*255,\s*255,\s*0\.8\)', "var(--glass-white-80)", "Glass white 80%"),
    (r'rgba\(255,\s*255,\s*255,\s*0\.6\)', "var(--glass-white-60)", "Glass white 60%"),
    (r'rgba\(255,\s*255,\s*255,\s*0\.4\)', "var(--glass-white-40)", "Glass white 40%"),
    (r'rgba\(0,\s*0,\s*0,\s*0\.8\)', "var(--glass-black-80)", "Glass black 80%"),
    (r'rgba\(0,\s*0,\s*0,\s*0\.6\)', "var(--glass-black-60)", "Glass black 60%"),
    (r'rgba\(0,\s*0,\s*0,\s*0\.1\)', "var(--glass-black-10)", "Glass black 10%"),
]

# Files/directories to exclude
EXCLUDE_PATTERNS = [
    'node_modules',
    '.next',
    '.git',
    'dist',
    'build',
    '__tests__',
    '.test.',
    '.spec.',
]

def should_process_file(filepath: Path) -> bool:
    """Check if file should be processed."""
    # Check extension
    if filepath.suffix not in ['.tsx', '.ts', '.jsx', '.js', '.css']:
        return False
    
    # Check exclude patterns
    path_str = str(filepath)
    for pattern in EXCLUDE_PATTERNS:
        if pattern in path_str:
            return False
    
    return True

def replace_in_file(filepath: Path) -> int:
    """Replace hardcoded colors in a file. Returns number of replacements."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        replacements_made = 0
        
        for pattern, replacement, description in REPLACEMENTS:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                replacements_made += 1
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return replacements_made
        
        return 0
    except Exception as e:
        print(f"  ⚠️  Error processing {filepath}: {e}")
        return 0

def main():
    print("🎨 Fixing hardcoded colors across the codebase...\n")
    
    # Find repository root
    repo_root = Path('/home/ubuntu/github_repos/loomOS')
    if not repo_root.exists():
        print("❌ Repository not found!")
        return
    
    # Directories to process
    dirs_to_process = [
        repo_root / 'components',
        repo_root / 'app',
        repo_root / 'pages',
    ]
    
    total_files_processed = 0
    total_replacements = 0
    files_modified = []
    
    # Process each directory
    for dir_path in dirs_to_process:
        if not dir_path.exists():
            continue
        
        print(f"📁 Processing {dir_path.name}/...")
        
        for filepath in dir_path.rglob('*'):
            if not filepath.is_file() or not should_process_file(filepath):
                continue
            
            replacements = replace_in_file(filepath)
            if replacements > 0:
                total_files_processed += 1
                total_replacements += replacements
                relative_path = filepath.relative_to(repo_root)
                files_modified.append((str(relative_path), replacements))
                print(f"  ✅ {relative_path} ({replacements} replacements)")
    
    print(f"\n📊 Summary:")
    print(f"  • Files modified: {total_files_processed}")
    print(f"  • Total replacements: {total_replacements}")
    
    if files_modified:
        print(f"\n📝 Modified files:")
        for filepath, count in sorted(files_modified, key=lambda x: x[1], reverse=True)[:20]:
            print(f"  • {filepath} ({count} replacements)")
        
        if len(files_modified) > 20:
            print(f"  ... and {len(files_modified) - 20} more files")
    
    print(f"\n✅ Color replacement complete!")
    print(f"\n⚠️  NOTE: Some hardcoded colors may be intentional.")
    print(f"   Please review changes before committing.")

if __name__ == '__main__':
    main()
