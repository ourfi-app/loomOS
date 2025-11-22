#!/usr/bin/env python3
"""
Phase 4 WebOS Design System Application Script

This script applies WebOS design tokens to dashboard pages following the patterns
established in Phases 2 and 3.

Key transformations:
1. Replace gradient backgrounds with var(--webos-bg-gradient)
2. Apply glassmorphism to cards and containers
3. Update typography to Helvetica Neue Light (font-weight: 300)
4. Replace color-coded elements with WebOS tokens
5. Replace shadows with WebOS shadow tokens
"""

import re
import os
from pathlib import Path
from typing import List, Dict, Tuple

# Define WebOS design patterns
WEBOS_PATTERNS = {
    # Background patterns
    'gradient_backgrounds': [
        (r'className="([^"]*\b)bg-gradient-to-[rblt](\s+from-\S+\s+to-\S+)([^"]*)"',
         r'className="\1\3" style={{ background: "var(--webos-bg-gradient)" }}'),
        (r'className="([^"]*\b)bg-gradient-[^"]*"', 
         r'className="\1" style={{ background: "var(--webos-bg-gradient)" }}'),
    ],
    
    # Card glassmorphism
    'card_glass': [
        (r'className="([^"]*\b)bg-white(\s[^"]*)"',
         r'className="\1rounded-3xl\2" style={{ background: "var(--webos-bg-glass)", backdropFilter: "blur(20px)", border: "1px solid var(--webos-border-glass)", boxShadow: "var(--webos-shadow-xl)" }}'),
    ],
    
    # Typography - font weights
    'typography': [
        (r'className="([^"]*)font-semibold([^"]*)"', r'className="\1font-light\2"'),
        (r'className="([^"]*)font-bold([^"]*)"', r'className="\1font-light\2"'),
        (r'className="([^"]*)font-medium([^"]*)"', r'className="\1font-light\2"'),
    ],
    
    # Nordic/semantic color replacements
    'colors': [
        (r'text-nordic-night', 'text-[var(--webos-text-primary)]'),
        (r'text-nordic-gray', 'text-[var(--webos-text-secondary)]'),
        (r'text-muted-foreground', 'text-[var(--webos-text-secondary)]'),
        (r'bg-nordic-frost', 'bg-[var(--webos-bg-secondary)]'),
        (r'border-nordic-frost', 'border-[var(--webos-border-primary)]'),
    ],
}

def read_file(file_path: str) -> str:
    """Read file contents."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(file_path: str, content: str):
    """Write content to file."""
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def add_webos_container_wrapper(content: str) -> str:
    """
    Add WebOS container wrapper if not present.
    Looks for the main return statement and wraps it.
    """
    # Check if already has webos-bg-gradient
    if 'var(--webos-bg-gradient)' in content:
        return content
    
    # Pattern to find return statement with main container
    return_pattern = r'return\s*\(\s*<(?!>)'
    
    if re.search(return_pattern, content):
        # Add container wrapper
        content = re.sub(
            r'return\s*\(\s*<',
            r'''return (
    <div 
      className="min-h-screen"
      style={{
        background: 'var(--webos-bg-gradient)',
        fontFamily: 'Helvetica Neue, Arial, sans-serif'
      }}
    >
      <''',
            content,
            count=1
        )
        
        # Close the wrapper div
        # Find the last closing tag before final semicolon
        content = re.sub(
            r'(</\w+>)\s*\);?\s*$',
            r'\1\n    </div>\n  );',
            content,
            count=1
        )
    
    return content

def apply_webos_patterns(content: str, file_name: str) -> Tuple[str, List[str]]:
    """
    Apply WebOS design patterns to file content.
    Returns modified content and list of changes made.
    """
    changes = []
    original_content = content
    
    # 1. Add container wrapper
    if '<div' in content and 'return' in content:
        new_content = add_webos_container_wrapper(content)
        if new_content != content:
            changes.append(f"Added WebOS container wrapper")
            content = new_content
    
    # 2. Apply pattern replacements
    for pattern_type, patterns in WEBOS_PATTERNS.items():
        for pattern, replacement in patterns:
            matches = re.findall(pattern, content)
            if matches:
                content = re.sub(pattern, replacement, content)
                changes.append(f"Applied {pattern_type}: {len(matches)} occurrences")
    
    return content, changes

def process_file(file_path: str, dry_run: bool = False) -> bool:
    """
    Process a single file and apply WebOS styling.
    Returns True if file was modified.
    """
    try:
        print(f"\n📄 Processing: {file_path}")
        
        content = read_file(file_path)
        modified_content, changes = apply_webos_patterns(content, os.path.basename(file_path))
        
        if changes:
            print(f"  ✨ Changes made:")
            for change in changes:
                print(f"    - {change}")
            
            if not dry_run:
                write_file(file_path, modified_content)
                print(f"  ✅ File updated")
            else:
                print(f"  🔍 (Dry run - no changes written)")
            
            return True
        else:
            print(f"  ℹ️  No changes needed")
            return False
            
    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return False

def get_target_pages() -> Dict[str, List[str]]:
    """Get list of target pages organized by priority."""
    base_path = "app/dashboard"
    
    return {
        "high_traffic": [
            f"{base_path}/chat/page.tsx",
            f"{base_path}/inbox/page.tsx",
            f"{base_path}/messages/page.tsx",
            f"{base_path}/notifications/page.tsx",
            f"{base_path}/documents/page.tsx",
            f"{base_path}/directory/page.tsx",
            f"{base_path}/contacts/page.tsx",
            f"{base_path}/profile/page.tsx",
        ],
        "admin": [
            f"{base_path}/admin/page.tsx",
            f"{base_path}/admin/announcements/page.tsx",
            f"{base_path}/admin/association/page.tsx",
            f"{base_path}/admin/directory-requests/page.tsx",
            f"{base_path}/admin/import-units/page.tsx",
            f"{base_path}/admin/payments/page.tsx",
            f"{base_path}/admin/property-map/page.tsx",
            f"{base_path}/admin/roles/page.tsx",
            f"{base_path}/admin/settings/page.tsx",
            f"{base_path}/admin/users/page.tsx",
        ],
        "apps": [
            f"{base_path}/apps/page.tsx",
            f"{base_path}/apps/accounting/page.tsx",
            f"{base_path}/apps/brandy/page.tsx",
            f"{base_path}/apps/budgeting/page.tsx",
            f"{base_path}/apps/calendar/page.tsx",
            f"{base_path}/apps/designer/page.tsx",
            f"{base_path}/apps/email/page.tsx",
            f"{base_path}/apps/notes/page.tsx",
            f"{base_path}/apps/tasks/page.tsx",
        ],
    }

def main():
    """Main execution function."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Apply Phase 4 WebOS styling to dashboard pages')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes without modifying files')
    parser.add_argument('--category', choices=['high_traffic', 'admin', 'apps', 'all'], 
                       default='all', help='Category of pages to process')
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("Phase 4 WebOS Design System Application")
    print("=" * 60)
    
    if args.dry_run:
        print("\n🔍 DRY RUN MODE - No files will be modified\n")
    
    target_pages = get_target_pages()
    
    if args.category == 'all':
        categories_to_process = list(target_pages.keys())
    else:
        categories_to_process = [args.category]
    
    total_modified = 0
    total_processed = 0
    
    for category in categories_to_process:
        pages = target_pages[category]
        print(f"\n{'='*60}")
        print(f"Processing category: {category.upper()}")
        print(f"{'='*60}")
        
        category_modified = 0
        for page in pages:
            if os.path.exists(page):
                total_processed += 1
                if process_file(page, args.dry_run):
                    category_modified += 1
                    total_modified += 1
            else:
                print(f"\n⚠️  File not found: {page}")
        
        print(f"\n✅ Category '{category}': {category_modified}/{len(pages)} files modified")
    
    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  Total processed: {total_processed}")
    print(f"  Total modified: {total_modified}")
    print(f"{'='*60}")
    
    if args.dry_run:
        print("\n💡 Run without --dry-run to apply changes")

if __name__ == "__main__":
    main()
