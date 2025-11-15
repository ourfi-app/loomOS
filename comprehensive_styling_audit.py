#!/usr/bin/env python3
"""
Comprehensive WebOS Styling Audit Script
Audits the entire loomOS repository for styling inconsistencies
"""

import os
import re
from collections import defaultdict
from pathlib import Path

# Define the patterns to search for
PATTERNS = {
    'hex_colors': {
        'pattern': r'#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b',
        'description': 'Hardcoded hex colors',
        'exclude_files': ['brandy/page.tsx', 'claude-demo/page.tsx']  # These have intentional color pickers
    },
    'rgb_colors': {
        'pattern': r'rgba?\([^)]+\)',
        'description': 'RGB/RGBA colors'
    },
    'tailwind_gray': {
        'pattern': r'(text|bg|border)-gray-\d+',
        'description': 'Tailwind gray classes'
    },
    'tailwind_blue': {
        'pattern': r'(text|bg|border)-blue-\d+',
        'description': 'Tailwind blue classes'
    },
    'tailwind_red': {
        'pattern': r'(text|bg|border)-red-\d+',
        'description': 'Tailwind red classes'
    },
    'tailwind_green': {
        'pattern': r'(text|bg|border)-green-\d+',
        'description': 'Tailwind green classes'
    },
    'tailwind_yellow': {
        'pattern': r'(text|bg|border)-yellow-\d+',
        'description': 'Tailwind yellow classes'
    },
    'tailwind_orange': {
        'pattern': r'(text|bg|border)-orange-\d+',
        'description': 'Tailwind orange classes'
    },
    'tailwind_purple': {
        'pattern': r'(text|bg|border)-purple-\d+',
        'description': 'Tailwind purple classes'
    },
    'tailwind_indigo': {
        'pattern': r'(text|bg|border)-indigo-\d+',
        'description': 'Tailwind indigo classes'
    },
    'tailwind_pink': {
        'pattern': r'(text|bg|border)-pink-\d+',
        'description': 'Tailwind pink classes'
    },
    'tailwind_slate': {
        'pattern': r'(text|bg|border)-slate-\d+',
        'description': 'Tailwind slate classes'
    },
    'tailwind_zinc': {
        'pattern': r'(text|bg|border)-zinc-\d+',
        'description': 'Tailwind zinc classes'
    },
    'tailwind_neutral': {
        'pattern': r'(text|bg|border)-neutral-\d+',
        'description': 'Tailwind neutral classes'
    },
    'tailwind_stone': {
        'pattern': r'(text|bg|border)-stone-\d+',
        'description': 'Tailwind stone classes'
    },
}

# Directories to scan
SCAN_DIRS = ['app', 'components']
FILE_EXTENSIONS = ['.tsx', '.ts']

def should_exclude_file(file_path):
    """Check if file should be excluded from audit"""
    for pattern_name, pattern_info in PATTERNS.items():
        if 'exclude_files' in pattern_info:
            for exclude in pattern_info['exclude_files']:
                if exclude in file_path:
                    return True
    return False

def scan_file(file_path):
    """Scan a single file for all patterns"""
    results = defaultdict(list)
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            lines = content.split('\n')
            
            for pattern_name, pattern_info in PATTERNS.items():
                pattern = pattern_info['pattern']
                
                for line_num, line in enumerate(lines, 1):
                    matches = re.finditer(pattern, line)
                    for match in matches:
                        results[pattern_name].append({
                            'line': line_num,
                            'match': match.group(),
                            'context': line.strip()[:100]
                        })
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    
    return results

def audit_repository(base_path='.'):
    """Audit the entire repository"""
    all_issues = defaultdict(lambda: defaultdict(list))
    file_counts = defaultdict(int)
    total_issues = 0
    
    for scan_dir in SCAN_DIRS:
        dir_path = Path(base_path) / scan_dir
        
        if not dir_path.exists():
            print(f"Directory {dir_path} not found, skipping...")
            continue
        
        for file_path in dir_path.rglob('*'):
            if file_path.suffix in FILE_EXTENSIONS:
                rel_path = str(file_path.relative_to(base_path))
                
                # Skip node_modules and other unwanted directories
                if 'node_modules' in rel_path or '.next' in rel_path:
                    continue
                
                # Skip intentionally excluded files
                if should_exclude_file(rel_path):
                    continue
                
                file_issues = scan_file(file_path)
                
                if file_issues:
                    for pattern_name, issues in file_issues.items():
                        if issues:
                            all_issues[pattern_name][rel_path] = issues
                            file_counts[pattern_name] += 1
                            total_issues += len(issues)
    
    return all_issues, file_counts, total_issues

def generate_report(all_issues, file_counts, total_issues):
    """Generate a comprehensive audit report"""
    report = []
    
    report.append("=" * 80)
    report.append("COMPREHENSIVE WEBOS STYLING AUDIT REPORT")
    report.append("=" * 80)
    report.append("")
    
    report.append("## EXECUTIVE SUMMARY")
    report.append(f"Total Issues Found: {total_issues}")
    report.append(f"Total Files Affected: {sum(file_counts.values())}")
    report.append("")
    
    report.append("## ISSUES BY CATEGORY")
    report.append("")
    
    for pattern_name, pattern_info in PATTERNS.items():
        count = sum(len(issues) for issues in all_issues[pattern_name].values())
        files = file_counts[pattern_name]
        
        report.append(f"### {pattern_info['description']}")
        report.append(f"   Issues: {count} across {files} files")
        report.append("")
    
    report.append("")
    report.append("=" * 80)
    report.append("## DETAILED BREAKDOWN BY CATEGORY")
    report.append("=" * 80)
    report.append("")
    
    for pattern_name, pattern_info in PATTERNS.items():
        pattern_issues = all_issues[pattern_name]
        
        if not pattern_issues:
            continue
        
        report.append(f"\n### {pattern_info['description'].upper()}")
        report.append(f"Pattern: {pattern_info['pattern']}")
        report.append(f"Total Issues: {sum(len(issues) for issues in pattern_issues.values())}")
        report.append(f"Files Affected: {len(pattern_issues)}")
        report.append("")
        
        # Sort files by number of issues
        sorted_files = sorted(pattern_issues.items(), key=lambda x: len(x[1]), reverse=True)
        
        report.append("Top 20 Files with Most Issues:")
        for file_path, issues in sorted_files[:20]:
            report.append(f"  {file_path}: {len(issues)} issues")
        
        report.append("")
        report.append("Sample Issues (first 10):")
        
        sample_count = 0
        for file_path, issues in sorted_files:
            if sample_count >= 10:
                break
            
            for issue in issues[:2]:  # Show first 2 issues per file
                if sample_count >= 10:
                    break
                
                report.append(f"  File: {file_path}")
                report.append(f"  Line {issue['line']}: {issue['match']}")
                report.append(f"  Context: {issue['context']}")
                report.append("")
                sample_count += 1
        
        report.append("-" * 80)
    
    report.append("")
    report.append("=" * 80)
    report.append("## FILES REQUIRING ATTENTION (Top 30)")
    report.append("=" * 80)
    report.append("")
    
    # Create a comprehensive file ranking
    file_issue_counts = defaultdict(int)
    for pattern_name, pattern_issues in all_issues.items():
        for file_path, issues in pattern_issues.items():
            file_issue_counts[file_path] += len(issues)
    
    sorted_files = sorted(file_issue_counts.items(), key=lambda x: x[1], reverse=True)
    
    for i, (file_path, count) in enumerate(sorted_files[:30], 1):
        report.append(f"{i}. {file_path}")
        report.append(f"   Total Issues: {count}")
        
        # Show breakdown by category
        categories = []
        for pattern_name, pattern_issues in all_issues.items():
            if file_path in pattern_issues:
                categories.append(f"{PATTERNS[pattern_name]['description']}: {len(pattern_issues[file_path])}")
        
        report.append(f"   Categories: {', '.join(categories)}")
        report.append("")
    
    report.append("=" * 80)
    report.append("## RECOMMENDATIONS")
    report.append("=" * 80)
    report.append("")
    report.append("1. Replace all hardcoded hex colors with CSS variables:")
    report.append("   - Background colors → var(--semantic-bg-base), var(--semantic-surface-base)")
    report.append("   - Text colors → var(--semantic-text-primary/secondary/tertiary)")
    report.append("   - Border colors → var(--semantic-border-light/medium/strong)")
    report.append("")
    report.append("2. Replace Tailwind color classes with semantic classes:")
    report.append("   - text-gray-X → inline styles with var(--semantic-text-X)")
    report.append("   - bg-gray-X → inline styles with var(--semantic-bg-X)")
    report.append("   - border-gray-X → inline styles with var(--semantic-border-X)")
    report.append("")
    report.append("3. Use webOS utility classes where appropriate:")
    report.append("   - .webos-gradient-bg for main backgrounds")
    report.append("   - .text-primary, .text-secondary, .text-tertiary for text")
    report.append("   - .bg-surface for cards and surfaces")
    report.append("")
    report.append("4. Maintain consistency in status/feedback colors:")
    report.append("   - Use semantic error, success, warning, info variables")
    report.append("")
    
    return '\n'.join(report)

def main():
    print("Starting comprehensive WebOS styling audit...")
    print("Scanning directories: app/, components/")
    print()
    
    all_issues, file_counts, total_issues = audit_repository()
    
    report = generate_report(all_issues, file_counts, total_issues)
    
    # Save report to file
    report_path = 'STYLING_AUDIT_REPORT.txt'
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"\nAudit complete! Report saved to: {report_path}")
    print(f"Total issues found: {total_issues}")
    print(f"Total files affected: {sum(file_counts.values())}")
    print()
    
    # Also print summary to console
    print("=" * 80)
    print("SUMMARY BY CATEGORY:")
    print("=" * 80)
    for pattern_name, pattern_info in PATTERNS.items():
        count = sum(len(issues) for issues in all_issues[pattern_name].values())
        files = file_counts[pattern_name]
        if count > 0:
            print(f"{pattern_info['description']:30s}: {count:5d} issues in {files:4d} files")

if __name__ == '__main__':
    main()
