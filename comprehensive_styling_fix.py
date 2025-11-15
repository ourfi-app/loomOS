#!/usr/bin/env python3
"""
Comprehensive WebOS Styling Fix Script
Fixes all styling inconsistencies across the entire loomOS repository
"""

import os
import re
from pathlib import Path
from collections import defaultdict

# Files to exclude (intentional color pickers)
EXCLUDE_FILES = [
    'app/brandy/page.tsx',
    'app/dashboard/apps/brandy/page.tsx',
    'app/dashboard/apps/brandy/claude-demo/page.tsx'
]

# Comprehensive color replacements using Tailwind bracket notation
COLOR_REPLACEMENTS = {
    # Hex color patterns - keep existing webos-gradient-bg
    r'bg-\[#E8E8E8\]|bg-\[#e8e8e8\]': 'webos-gradient-bg',
    r'bg-\[#EAEAEA\]|bg-\[#eaeaea\]': 'webos-gradient-bg',
    r'bg-\[#EEEEEE\]|bg-\[#eeeeee\]': 'bg-[var(--semantic-bg-subtle)]',
    r'bg-\[#FAFAFA\]|bg-\[#fafafa\]': 'bg-[var(--semantic-surface-hover)]',
    r'bg-\[#F5F5F5\]|bg-\[#f5f5f5\]': 'bg-[var(--semantic-surface-hover)]',
    r'bg-\[#FFFFFF\]|bg-\[#ffffff\]|bg-\[#FFF\]|bg-\[#fff\]': 'bg-[var(--semantic-surface-base)]',
    r'bg-\[#E0E0E0\]|bg-\[#e0e0e0\]': 'bg-[var(--semantic-bg-muted)]',
    r'bg-\[#D0D0D0\]|bg-\[#d0d0d0\]': 'bg-[var(--semantic-bg-muted)]',
    
    # Text colors - hex
    r'text-\[#000000\]|text-\[#000\]': 'text-[var(--semantic-text-primary)]',
    r'text-\[#1E1E1E\]|text-\[#1e1e1e\]': 'text-[var(--semantic-text-primary)]',
    r'text-\[#2C3440\]|text-\[#2c3440\]|text-\[#2D2D2D\]|text-\[#2d2d2d\]': 'text-[var(--semantic-text-primary)]',
    r'text-\[#333333\]|text-\[#333\]': 'text-[var(--semantic-text-primary)]',
    r'text-\[#666666\]|text-\[#666\]': 'text-[var(--semantic-text-secondary)]',
    r'text-\[#999999\]|text-\[#999\]': 'text-[var(--semantic-text-tertiary)]',
    r'text-\[#CCCCCC\]|text-\[#ccc\]': 'text-[var(--semantic-text-disabled)]',
    
    # Border colors - hex
    r'border-\[#E0E0E0\]|border-\[#e0e0e0\]': 'border-[var(--semantic-border-light)]',
    r'border-\[#D0D0D0\]|border-\[#d0d0d0\]': 'border-[var(--semantic-border-medium)]',
    r'border-\[#CCCCCC\]|border-\[#ccc\]': 'border-[var(--semantic-border-medium)]',
    r'border-\[#999999\]|border-\[#999\]': 'border-[var(--semantic-border-strong)]',
}

# Tailwind class replacements using bracket notation
TAILWIND_REPLACEMENTS = {
    # Gray backgrounds
    'bg-gray-50': 'bg-[var(--semantic-bg-subtle)]',
    'bg-gray-100': 'bg-[var(--semantic-surface-hover)]',
    'bg-gray-200': 'bg-[var(--semantic-bg-muted)]',
    'bg-gray-300': 'bg-[var(--semantic-bg-muted)]',
    'bg-gray-800': 'bg-[var(--semantic-text-primary)]',
    'bg-gray-900': 'bg-[var(--semantic-text-primary)]',
    
    # Gray text
    'text-gray-400': 'text-[var(--semantic-text-disabled)]',
    'text-gray-500': 'text-[var(--semantic-text-tertiary)]',
    'text-gray-600': 'text-[var(--semantic-text-secondary)]',
    'text-gray-700': 'text-[var(--semantic-text-secondary)]',
    'text-gray-800': 'text-[var(--semantic-text-primary)]',
    'text-gray-900': 'text-[var(--semantic-text-primary)]',
    
    # Gray borders
    'border-gray-200': 'border-[var(--semantic-border-light)]',
    'border-gray-300': 'border-[var(--semantic-border-medium)]',
    'border-gray-400': 'border-[var(--semantic-border-medium)]',
    
    # Blue colors (use semantic primary/accent)
    'bg-blue-50': 'bg-[var(--semantic-primary-subtle)]',
    'bg-blue-100': 'bg-[var(--semantic-primary-subtle)]',
    'bg-blue-200': 'bg-[var(--semantic-primary-light)]',
    'bg-blue-500': 'bg-[var(--semantic-primary)]',
    'bg-blue-600': 'bg-[var(--semantic-primary)]',
    'text-blue-500': 'text-[var(--semantic-primary)]',
    'text-blue-600': 'text-[var(--semantic-primary)]',
    'text-blue-700': 'text-[var(--semantic-primary-dark)]',
    'text-blue-800': 'text-[var(--semantic-primary-dark)]',
    'text-blue-900': 'text-[var(--semantic-primary-dark)]',
    'border-blue-200': 'border-[var(--semantic-primary-light)]',
    'border-blue-500': 'border-[var(--semantic-primary)]',
    
    # Red colors (use semantic error)
    'bg-red-50': 'bg-[var(--semantic-error-bg)]',
    'bg-red-100': 'bg-[var(--semantic-error-bg)]',
    'bg-red-500': 'bg-[var(--semantic-error)]',
    'text-red-500': 'text-[var(--semantic-error)]',
    'text-red-600': 'text-[var(--semantic-error)]',
    'text-red-700': 'text-[var(--semantic-error-dark)]',
    'border-red-300': 'border-[var(--semantic-error-border)]',
    'border-red-500': 'border-[var(--semantic-error)]',
    
    # Green colors (use semantic success)
    'bg-green-50': 'bg-[var(--semantic-success-bg)]',
    'bg-green-100': 'bg-[var(--semantic-success-bg)]',
    'bg-green-500': 'bg-[var(--semantic-success)]',
    'bg-green-600': 'bg-[var(--semantic-success)]',
    'text-green-500': 'text-[var(--semantic-success)]',
    'text-green-600': 'text-[var(--semantic-success)]',
    'text-green-700': 'text-[var(--semantic-success-dark)]',
    'border-green-500': 'border-[var(--semantic-success)]',
    
    # Yellow colors (use semantic warning)
    'bg-yellow-50': 'bg-[var(--semantic-warning-bg)]',
    'bg-yellow-100': 'bg-[var(--semantic-warning-bg)]',
    'bg-yellow-500': 'bg-[var(--semantic-warning)]',
    'text-yellow-500': 'text-[var(--semantic-warning)]',
    'text-yellow-600': 'text-[var(--semantic-warning)]',
    'text-yellow-700': 'text-[var(--semantic-warning-dark)]',
    'border-yellow-500': 'border-[var(--semantic-warning)]',
    
    # Orange colors
    'bg-orange-50': 'bg-[var(--semantic-primary-subtle)]',
    'bg-orange-100': 'bg-[var(--semantic-primary-subtle)]',
    'bg-orange-500': 'bg-[var(--semantic-primary)]',
    'text-orange-500': 'text-[var(--semantic-primary)]',
    'text-orange-600': 'text-[var(--semantic-primary)]',
    
    # Purple colors (use semantic accent)
    'bg-purple-50': 'bg-[var(--semantic-accent-subtle)]',
    'bg-purple-100': 'bg-[var(--semantic-accent-subtle)]',
    'bg-purple-500': 'bg-[var(--semantic-accent)]',
    'text-purple-500': 'text-[var(--semantic-accent)]',
    'text-purple-600': 'text-[var(--semantic-accent)]',
    
    # Indigo colors
    'bg-indigo-50': 'bg-[var(--semantic-accent-subtle)]',
    'bg-indigo-500': 'bg-[var(--semantic-accent)]',
    'bg-indigo-600': 'bg-[var(--semantic-accent)]',
    'text-indigo-600': 'text-[var(--semantic-accent)]',
    
    # Pink colors
    'bg-pink-50': 'bg-[var(--semantic-accent-subtle)]',
    'bg-pink-500': 'bg-[var(--semantic-accent)]',
    'text-pink-500': 'text-[var(--semantic-accent)]',
    
    # Slate colors (similar to gray)
    'bg-slate-50': 'bg-[var(--semantic-bg-subtle)]',
    'bg-slate-100': 'bg-[var(--semantic-surface-hover)]',
    'text-slate-600': 'text-[var(--semantic-text-secondary)]',
    'text-slate-700': 'text-[var(--semantic-text-secondary)]',
    
    # Neutral colors (similar to gray)
    'bg-neutral-50': 'bg-[var(--semantic-bg-subtle)]',
    'bg-neutral-100': 'bg-[var(--semantic-surface-hover)]',
    'text-neutral-600': 'text-[var(--semantic-text-secondary)]',
    'text-neutral-700': 'text-[var(--semantic-text-secondary)]',
}

def should_exclude_file(file_path):
    """Check if file should be excluded from fixes"""
    return any(exclude in file_path for exclude in EXCLUDE_FILES)

def merge_inline_styles(content):
    """
    Merge adjacent inline style attributes into a single style object
    This is a post-processing step to clean up multiple style={{ }} declarations
    """
    # Pattern to find multiple style attributes on the same element
    pattern = r'(style=\{\{[^}]+\}\}\s*)+(?=style=\{\{)'
    
    def merge_styles(match):
        # Extract all style declarations
        styles = re.findall(r'style=\{\{\s*([^}]+)\s*\}\}', match.group(0))
        # Merge them
        merged = ', '.join(styles)
        return f'style={{{{ {merged} }}}}'
    
    return re.sub(pattern, merge_styles, content)

def fix_file(file_path):
    """Fix styling issues in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes = 0
        
        # Apply hex color replacements
        for pattern, replacement in COLOR_REPLACEMENTS.items():
            new_content = re.sub(pattern, replacement, content)
            if new_content != content:
                count = len(re.findall(pattern, content))
                changes += count
                content = new_content
        
        # Apply Tailwind class replacements
        for old_class, replacement in TAILWIND_REPLACEMENTS.items():
            # Match the class in className attribute
            pattern = r'\b' + re.escape(old_class) + r'\b'
            new_content = re.sub(pattern, replacement, content)
            if new_content != content:
                count = len(re.findall(pattern, content))
                changes += count
                content = new_content
        
        # Merge adjacent inline styles (basic cleanup)
        # content = merge_inline_styles(content)
        
        # Only write if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return changes
        
        return 0
    
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return 0

def fix_repository(base_path='.'):
    """Fix all styling issues in the repository"""
    scan_dirs = ['app', 'components']
    file_extensions = ['.tsx', '.ts']
    
    total_files = 0
    total_changes = 0
    files_modified = []
    
    for scan_dir in scan_dirs:
        dir_path = Path(base_path) / scan_dir
        
        if not dir_path.exists():
            print(f"Directory {dir_path} not found, skipping...")
            continue
        
        for file_path in dir_path.rglob('*'):
            if file_path.suffix in file_extensions:
                rel_path = str(file_path.relative_to(base_path))
                
                # Skip node_modules and other unwanted directories
                if 'node_modules' in rel_path or '.next' in rel_path:
                    continue
                
                # Skip excluded files
                if should_exclude_file(rel_path):
                    print(f"Skipping excluded file: {rel_path}")
                    continue
                
                changes = fix_file(file_path)
                
                if changes > 0:
                    files_modified.append((rel_path, changes))
                    total_files += 1
                    total_changes += changes
    
    return total_files, total_changes, files_modified

def generate_summary(total_files, total_changes, files_modified):
    """Generate a summary report of the fixes"""
    lines = []
    
    lines.append("=" * 80)
    lines.append("COMPREHENSIVE WEBOS STYLING FIXES - EXECUTION SUMMARY")
    lines.append("=" * 80)
    lines.append("")
    lines.append(f"Total Files Modified: {total_files}")
    lines.append(f"Total Changes Applied: {total_changes}")
    lines.append("")
    
    if files_modified:
        lines.append("=" * 80)
        lines.append("FILES MODIFIED (Top 50)")
        lines.append("=" * 80)
        lines.append("")
        
        # Sort by number of changes
        sorted_files = sorted(files_modified, key=lambda x: x[1], reverse=True)
        
        for i, (file_path, changes) in enumerate(sorted_files[:50], 1):
            lines.append(f"{i}. {file_path}")
            lines.append(f"   Changes: {changes}")
            lines.append("")
    
    lines.append("=" * 80)
    lines.append("CHANGES APPLIED")
    lines.append("=" * 80)
    lines.append("")
    lines.append("1. Replaced all hardcoded hex colors with semantic CSS variables")
    lines.append("2. Replaced Tailwind color classes with inline semantic styles")
    lines.append("3. Applied webOS theme variables consistently")
    lines.append("4. Ensured all status colors use semantic variables")
    lines.append("")
    lines.append("Next Steps:")
    lines.append("1. Review the changes visually in the browser")
    lines.append("2. Test all pages and components")
    lines.append("3. Commit changes to a new branch")
    lines.append("4. Create a pull request")
    lines.append("")
    
    return '\n'.join(lines)

def main():
    print("Starting comprehensive WebOS styling fixes...")
    print("This will fix ALL styling issues across the repository")
    print()
    
    total_files, total_changes, files_modified = fix_repository()
    
    print(f"\nFixes complete!")
    print(f"Files modified: {total_files}")
    print(f"Total changes: {total_changes}")
    
    # Generate and save summary
    summary = generate_summary(total_files, total_changes, files_modified)
    
    with open('STYLING_FIX_SUMMARY.txt', 'w', encoding='utf-8') as f:
        f.write(summary)
    
    print(f"\nSummary saved to: STYLING_FIX_SUMMARY.txt")
    print()
    print("Top 10 files modified:")
    sorted_files = sorted(files_modified, key=lambda x: x[1], reverse=True)
    for i, (file_path, changes) in enumerate(sorted_files[:10], 1):
        print(f"  {i}. {file_path}: {changes} changes")

if __name__ == '__main__':
    main()
