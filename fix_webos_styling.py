#!/usr/bin/env python3
"""
Comprehensive WebOS Styling Fixer
Replaces hardcoded colors and Tailwind gray classes with webOS semantic tokens
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Tuple

# Color replacements mapping
COLOR_REPLACEMENTS = {
    # Background colors
    r'bg-\[#E8E8E8\]': 'webos-gradient-bg',
    r'bg-\[#e8e8e8\]': 'webos-gradient-bg',
    r'bg-\[#FAFAFA\]': "bg-[var(--semantic-surface-hover)]",
    r'bg-\[#fafafa\]': "bg-[var(--semantic-surface-hover)]",
    r'bg-\[#FFFFFF\]': "bg-[var(--semantic-surface-base)]",
    r'bg-\[#ffffff\]': "bg-[var(--semantic-surface-base)]",
    r'bg-\[#F8F8F8\]': "bg-[var(--semantic-surface-hover)]",
    r'bg-\[#f8f8f8\]': "bg-[var(--semantic-surface-hover)]",
    r'bg-\[#F5F5F5\]': "bg-[var(--semantic-surface-hover)]",
    r'bg-\[#f5f5f5\]': "bg-[var(--semantic-surface-hover)]",
    r'bg-\[#EEEEEE\]': "bg-[var(--semantic-bg-subtle)]",
    r'bg-\[#eeeeee\]': "bg-[var(--semantic-bg-subtle)]",
    
    # Border colors
    r'border-\[#E0E0E0\]': "border-[var(--semantic-border-light)]",
    r'border-\[#e0e0e0\]': "border-[var(--semantic-border-light)]",
    r'border-\[#D0D0D0\]': "border-[var(--semantic-border-medium)]",
    r'border-\[#d0d0d0\]': "border-[var(--semantic-border-medium)]",
    r'border-\[#CCCCCC\]': "border-[var(--semantic-border-medium)]",
    r'border-\[#cccccc\]': "border-[var(--semantic-border-medium)]",
    
    # Text colors
    r'text-\[#1E1E1E\]': "text-[var(--semantic-text-primary)]",
    r'text-\[#1e1e1e\]': "text-[var(--semantic-text-primary)]",
    r'text-\[#2D2D2D\]': "text-[var(--semantic-text-primary)]",
    r'text-\[#2d2d2d\]': "text-[var(--semantic-text-primary)]",
    r'text-\[#666\]': "text-[var(--semantic-text-secondary)]",
    r'text-\[#666666\]': "text-[var(--semantic-text-secondary)]",
    r'text-\[#6B6B6B\]': "text-[var(--semantic-text-secondary)]",
    r'text-\[#6b6b6b\]': "text-[var(--semantic-text-secondary)]",
    r'text-\[#999\]': "text-[var(--semantic-text-tertiary)]",
    r'text-\[#999999\]': "text-[var(--semantic-text-tertiary)]",
    
    # Error colors
    r'bg-\[#FEE2E2\]': "bg-[var(--semantic-error-bg)]",
    r'bg-\[#fee2e2\]': "bg-[var(--semantic-error-bg)]",
    r'border-\[#FCA5A5\]': "border-[var(--semantic-error-border)]",
    r'border-\[#fca5a5\]': "border-[var(--semantic-error-border)]",
    r'text-\[#DC2626\]': "text-[var(--semantic-error)]",
    r'text-\[#dc2626\]': "text-[var(--semantic-error)]",
}

# Tailwind gray class replacements
GRAY_CLASS_REPLACEMENTS = {
    # Background grays
    r'\bbg-gray-50\b': "bg-[var(--semantic-bg-subtle)]",
    r'\bbg-gray-100\b': "bg-[var(--semantic-surface-hover)]",
    r'\bbg-gray-200\b': "bg-[var(--semantic-bg-muted)]",
    
    # Hover states
    r'\bhover:bg-gray-50\b': "hover:bg-[var(--semantic-surface-hover)]",
    r'\bhover:bg-gray-100\b': "hover:bg-[var(--semantic-surface-hover)]",
    r'\bhover:bg-gray-200\b': "hover:bg-[var(--semantic-bg-muted)]",
    
    # Border grays
    r'\bborder-gray-100\b': "border-[var(--semantic-border-light)]",
    r'\bborder-gray-200\b': "border-[var(--semantic-border-light)]",
    r'\bborder-gray-300\b': "border-[var(--semantic-border-medium)]",
    r'\bborder-gray-400\b': "border-[var(--semantic-border-strong)]",
    
    # Text grays
    r'\btext-gray-400\b': "text-[var(--semantic-text-tertiary)]",
    r'\btext-gray-500\b': "text-[var(--semantic-text-tertiary)]",
    r'\btext-gray-600\b': "text-[var(--semantic-text-secondary)]",
    r'\btext-gray-700\b': "text-[var(--semantic-text-secondary)]",
    r'\btext-gray-800\b': "text-[var(--semantic-text-primary)]",
    r'\btext-gray-900\b': "text-[var(--semantic-text-primary)]",
}

def fix_file_styling(file_path: Path) -> Tuple[bool, int]:
    """
    Fix styling in a single file
    Returns: (was_modified, num_replacements)
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        replacements = 0
        
        # Apply color replacements
        for pattern, replacement in COLOR_REPLACEMENTS.items():
            matches = len(re.findall(pattern, content))
            if matches > 0:
                content = re.sub(pattern, replacement, content)
                replacements += matches
        
        # Apply gray class replacements
        for pattern, replacement in GRAY_CLASS_REPLACEMENTS.items():
            matches = len(re.findall(pattern, content))
            if matches > 0:
                content = re.sub(pattern, replacement, content)
                replacements += matches
        
        # Only write if changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return (True, replacements)
        
        return (False, 0)
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return (False, 0)

def main():
    """Main function to fix all files"""
    base_path = Path('/home/ubuntu/github_repos/loomOS')
    
    # Directories to process
    directories = [
        base_path / 'app',
        base_path / 'components',
    ]
    
    total_files = 0
    modified_files = 0
    total_replacements = 0
    
    modified_file_list = []
    
    print("🔧 Starting comprehensive webOS styling fixes...")
    print("=" * 60)
    
    for directory in directories:
        if not directory.exists():
            continue
            
        # Find all TSX and TS files
        for file_path in directory.rglob('*.tsx'):
            total_files += 1
            was_modified, num_replacements = fix_file_styling(file_path)
            
            if was_modified:
                modified_files += 1
                total_replacements += num_replacements
                relative_path = file_path.relative_to(base_path)
                modified_file_list.append((str(relative_path), num_replacements))
                print(f"✓ Fixed: {relative_path} ({num_replacements} changes)")
    
    print("=" * 60)
    print(f"\n📊 Summary:")
    print(f"   Total files scanned: {total_files}")
    print(f"   Files modified: {modified_files}")
    print(f"   Total replacements: {total_replacements}")
    
    if modified_file_list:
        print(f"\n📝 Modified files:")
        for file_path, count in sorted(modified_file_list, key=lambda x: x[1], reverse=True):
            print(f"   - {file_path}: {count} changes")
    
    print("\n✅ Styling fixes completed!")

if __name__ == '__main__':
    main()
