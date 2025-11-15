#!/usr/bin/env python3
"""
Enhanced Comprehensive WebOS Styling Fix Script - Version 2
Covers additional patterns including dark mode variants and more shades
"""

import os
import re
from pathlib import Path

# Files to exclude (intentional color pickers)
EXCLUDE_FILES = [
    'app/brandy/page.tsx',
    'app/dashboard/apps/brandy/page.tsx',
    'app/dashboard/apps/brandy/claude-demo/page.tsx'
]

# Additional Tailwind patterns to fix (including more shades and dark mode)
ADDITIONAL_TAILWIND_REPLACEMENTS = {
    # Additional gray shades
    'text-gray-100': 'text-[var(--semantic-text-inverse)]',
    'text-gray-200': 'text-[var(--semantic-text-tertiary)]',
    'text-gray-300': 'text-[var(--semantic-text-tertiary)]',
    'bg-gray-400': 'bg-[var(--semantic-border-strong)]',
    'bg-gray-500': 'bg-[var(--semantic-text-tertiary)]',
    'bg-gray-600': 'bg-[var(--semantic-text-secondary)]',
    'bg-gray-700': 'bg-[var(--semantic-text-secondary)]',
    'border-gray-100': 'border-[var(--semantic-border-light)]',
    'border-gray-500': 'border-[var(--semantic-border-strong)]',
    'border-gray-600': 'border-[var(--semantic-border-strong)]',
    'border-gray-700': 'border-[var(--semantic-border-strong)]',
    'border-gray-800': 'border-[var(--semantic-text-primary)]',
    
    # Additional blue shades
    'bg-blue-200': 'bg-[var(--semantic-primary-light)]',
    'bg-blue-300': 'bg-[var(--semantic-primary-light)]',
    'bg-blue-400': 'bg-[var(--semantic-primary)]',
    'bg-blue-700': 'bg-[var(--semantic-primary-dark)]',
    'bg-blue-800': 'bg-[var(--semantic-primary-dark)]',
    'bg-blue-900': 'bg-[var(--semantic-primary-dark)]',
    'text-blue-400': 'text-[var(--semantic-primary)]',
    'text-blue-800': 'text-[var(--semantic-primary-dark)]',
    'text-blue-900': 'text-[var(--semantic-primary-dark)]',
    'border-blue-100': 'border-[var(--semantic-primary-light)]',
    'border-blue-200': 'border-[var(--semantic-primary-light)]',
    'border-blue-300': 'border-[var(--semantic-primary-light)]',
    'border-blue-400': 'border-[var(--semantic-primary)]',
    'border-blue-600': 'border-[var(--semantic-primary)]',
    
    # Additional red shades
    'bg-red-200': 'bg-[var(--semantic-error-bg)]',
    'bg-red-300': 'bg-[var(--semantic-error-border)]',
    'bg-red-400': 'bg-[var(--semantic-error)]',
    'bg-red-600': 'bg-[var(--semantic-error)]',
    'bg-red-700': 'bg-[var(--semantic-error-dark)]',
    'text-red-400': 'text-[var(--semantic-error)]',
    'text-red-800': 'text-[var(--semantic-error-dark)]',
    'text-red-900': 'text-[var(--semantic-error-dark)]',
    'border-red-100': 'border-[var(--semantic-error-bg)]',
    'border-red-200': 'border-[var(--semantic-error-border)]',
    'border-red-400': 'border-[var(--semantic-error)]',
    'border-red-600': 'border-[var(--semantic-error)]',
    
    # Additional green shades
    'bg-green-200': 'bg-[var(--semantic-success-bg)]',
    'bg-green-300': 'bg-[var(--semantic-success-border)]',
    'bg-green-400': 'bg-[var(--semantic-success)]',
    'bg-green-700': 'bg-[var(--semantic-success-dark)]',
    'text-green-400': 'text-[var(--semantic-success)]',
    'text-green-800': 'text-[var(--semantic-success-dark)]',
    'border-green-200': 'border-[var(--semantic-success-bg)]',
    'border-green-300': 'border-[var(--semantic-success-border)]',
    'border-green-400': 'border-[var(--semantic-success)]',
    'border-green-600': 'border-[var(--semantic-success)]',
    
    # Additional yellow shades
    'bg-yellow-200': 'bg-[var(--semantic-warning-bg)]',
    'bg-yellow-300': 'bg-[var(--semantic-warning-border)]',
    'bg-yellow-400': 'bg-[var(--semantic-warning)]',
    'text-yellow-400': 'text-[var(--semantic-warning)]',
    'text-yellow-800': 'text-[var(--semantic-warning-dark)]',
    'border-yellow-200': 'border-[var(--semantic-warning-bg)]',
    'border-yellow-300': 'border-[var(--semantic-warning-border)]',
    'border-yellow-400': 'border-[var(--semantic-warning)]',
    
    # Additional orange shades
    'bg-orange-200': 'bg-[var(--semantic-primary-light)]',
    'bg-orange-300': 'bg-[var(--semantic-primary-light)]',
    'bg-orange-400': 'bg-[var(--semantic-primary)]',
    'bg-orange-600': 'bg-[var(--semantic-primary-dark)]',
    'text-orange-400': 'text-[var(--semantic-primary)]',
    'text-orange-700': 'text-[var(--semantic-primary-dark)]',
    'border-orange-200': 'border-[var(--semantic-primary-light)]',
    'border-orange-300': 'border-[var(--semantic-primary-light)]',
    
    # Additional purple shades
    'bg-purple-200': 'bg-[var(--semantic-accent-light)]',
    'bg-purple-300': 'bg-[var(--semantic-accent-light)]',
    'bg-purple-400': 'bg-[var(--semantic-accent)]',
    'bg-purple-600': 'bg-[var(--semantic-accent-dark)]',
    'text-purple-400': 'text-[var(--semantic-accent)]',
    'text-purple-700': 'text-[var(--semantic-accent-dark)]',
    'border-purple-200': 'border-[var(--semantic-accent-light)]',
    'border-purple-300': 'border-[var(--semantic-accent-light)]',
    
    # Additional indigo shades
    'bg-indigo-100': 'bg-[var(--semantic-accent-subtle)]',
    'bg-indigo-200': 'bg-[var(--semantic-accent-light)]',
    'bg-indigo-300': 'bg-[var(--semantic-accent-light)]',
    'bg-indigo-400': 'bg-[var(--semantic-accent)]',
    'bg-indigo-600': 'bg-[var(--semantic-accent-dark)]',
    'text-indigo-500': 'text-[var(--semantic-accent)]',
    'text-indigo-700': 'text-[var(--semantic-accent-dark)]',
    'border-indigo-200': 'border-[var(--semantic-accent-light)]',
    
    # Additional pink shades
    'bg-pink-100': 'bg-[var(--semantic-accent-subtle)]',
    'bg-pink-200': 'bg-[var(--semantic-accent-light)]',
    'bg-pink-300': 'bg-[var(--semantic-accent-light)]',
    'bg-pink-400': 'bg-[var(--semantic-accent)]',
    'bg-pink-600': 'bg-[var(--semantic-accent-dark)]',
    'text-pink-400': 'text-[var(--semantic-accent)]',
    'text-pink-600': 'text-[var(--semantic-accent)]',
    'text-pink-700': 'text-[var(--semantic-accent-dark)]',
    'border-pink-200': 'border-[var(--semantic-accent-light)]',
    
    # Additional slate shades
    'bg-slate-200': 'bg-[var(--semantic-bg-muted)]',
    'bg-slate-300': 'bg-[var(--semantic-bg-muted)]',
    'bg-slate-400': 'bg-[var(--semantic-border-strong)]',
    'bg-slate-500': 'bg-[var(--semantic-text-tertiary)]',
    'text-slate-500': 'text-[var(--semantic-text-tertiary)]',
    'text-slate-800': 'text-[var(--semantic-text-primary)]',
    'text-slate-900': 'text-[var(--semantic-text-primary)]',
    'border-slate-200': 'border-[var(--semantic-border-light)]',
    'border-slate-300': 'border-[var(--semantic-border-medium)]',
    
    # Additional neutral shades
    'bg-neutral-200': 'bg-[var(--semantic-bg-muted)]',
    'bg-neutral-300': 'bg-[var(--semantic-bg-muted)]',
    'bg-neutral-400': 'bg-[var(--semantic-border-strong)]',
    'bg-neutral-500': 'bg-[var(--semantic-text-tertiary)]',
    'text-neutral-500': 'text-[var(--semantic-text-tertiary)]',
    'text-neutral-800': 'text-[var(--semantic-text-primary)]',
    'text-neutral-900': 'text-[var(--semantic-text-primary)]',
    'border-neutral-200': 'border-[var(--semantic-border-light)]',
    'border-neutral-300': 'border-[var(--semantic-border-medium)]',
}

# Additional hex color patterns
ADDITIONAL_HEX_REPLACEMENTS = {
    r'text-\[#6B7280\]': 'text-[var(--semantic-text-secondary)]',
    r'text-\[#6b7280\]': 'text-[var(--semantic-text-secondary)]',
    r'text-\[#9CA3AF\]': 'text-[var(--semantic-text-tertiary)]',
    r'text-\[#9ca3af\]': 'text-[var(--semantic-text-tertiary)]',
    r'text-\[#D1D5DB\]': 'text-[var(--semantic-text-disabled)]',
    r'text-\[#d1d5db\]': 'text-[var(--semantic-text-disabled)]',
    r'border-\[#D8D6D3\]': 'border-[var(--semantic-border-medium)]',
    r'border-\[#d8d6d3\]': 'border-[var(--semantic-border-medium)]',
    r'bg-\[#F3F4F6\]': 'bg-[var(--semantic-bg-subtle)]',
    r'bg-\[#f3f4f6\]': 'bg-[var(--semantic-bg-subtle)]',
}

def should_exclude_file(file_path):
    """Check if file should be excluded from fixes"""
    return any(exclude in file_path for exclude in EXCLUDE_FILES)

def fix_file(file_path):
    """Fix styling issues in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes = 0
        
        # Apply additional hex color replacements
        for pattern, replacement in ADDITIONAL_HEX_REPLACEMENTS.items():
            new_content = re.sub(pattern, replacement, content)
            if new_content != content:
                count = len(re.findall(pattern, content))
                changes += count
                content = new_content
        
        # Apply additional Tailwind class replacements
        for old_class, replacement in ADDITIONAL_TAILWIND_REPLACEMENTS.items():
            # Match the class in className attribute
            pattern = r'\b' + re.escape(old_class) + r'\b'
            new_content = re.sub(pattern, replacement, content)
            if new_content != content:
                count = len(re.findall(pattern, content))
                changes += count
                content = new_content
        
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
                    continue
                
                changes = fix_file(file_path)
                
                if changes > 0:
                    files_modified.append((rel_path, changes))
                    total_files += 1
                    total_changes += changes
    
    return total_files, total_changes, files_modified

def main():
    print("Starting ENHANCED WebOS styling fixes (V2)...")
    print("This will fix additional styling issues including dark mode variants")
    print()
    
    total_files, total_changes, files_modified = fix_repository()
    
    print(f"\nAdditional fixes complete!")
    print(f"Files modified: {total_files}")
    print(f"Total changes: {total_changes}")
    
    if files_modified:
        print()
        print("Top 20 files modified:")
        sorted_files = sorted(files_modified, key=lambda x: x[1], reverse=True)
        for i, (file_path, changes) in enumerate(sorted_files[:20], 1):
            print(f"  {i}. {file_path}: {changes} changes")

if __name__ == '__main__':
    main()
