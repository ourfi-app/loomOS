#!/bin/bash

# Script to replace hardcoded colors with design tokens
# This handles the 357 instances of hardcoded colors identified in the audit

echo "🎨 Fixing hardcoded colors across the codebase..."

cd /home/ubuntu/github_repos/loomOS

# Counter for changes
CHANGES=0

# Function to replace in files
replace_in_files() {
    local pattern=$1
    local replacement=$2
    local description=$3
    
    echo "  → Replacing $description..."
    
    # Find and replace in tsx/ts/jsx/js files
    find components pages app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) \
        -exec grep -l "$pattern" {} \; 2>/dev/null | while read file; do
        sed -i "s/$pattern/$replacement/g" "$file" 2>/dev/null && ((CHANGES++))
    done
}

# ============================================================================
# PRIMARY BRAND COLORS
# ============================================================================
echo ""
echo "🟠 Fixing primary brand colors (loomOS Orange)..."

# #F18825 → var(--semantic-primary)
replace_in_files "#F18825" "var(--semantic-primary)" "loomOS Orange (#F18825)"
replace_in_files "#f18825" "var(--semantic-primary)" "loomOS Orange (lowercase)"
replace_in_files "text-\[#F18825\]" "text-primary" "Tailwind text color"
replace_in_files "bg-\[#F18825\]" "bg-primary" "Tailwind bg color"
replace_in_files "border-\[#F18825\]" "border-primary" "Tailwind border color"

# ============================================================================
# SECONDARY/ACCENT COLORS  
# ============================================================================
echo ""
echo "🔵 Fixing secondary/accent colors (Trust Blue)..."

# #2B8ED9 → var(--semantic-accent)
replace_in_files "#2B8ED9" "var(--semantic-accent)" "Trust Blue (#2B8ED9)"
replace_in_files "#2b8ed9" "var(--semantic-accent)" "Trust Blue (lowercase)"
replace_in_files "text-\[#2B8ED9\]" "text-accent" "Tailwind text color"
replace_in_files "bg-\[#2B8ED9\]" "bg-accent" "Tailwind bg color"

# ============================================================================
# TEXT COLORS
# ============================================================================
echo ""
echo "📝 Fixing text colors..."

# #4a4a4a → var(--semantic-text-primary)
replace_in_files "#4a4a4a" "var(--semantic-text-primary)" "Dark gray text (#4a4a4a)"
replace_in_files "#4A4A4A" "var(--semantic-text-primary)" "Dark gray text (uppercase)"

# #8a8a8a → var(--semantic-text-tertiary)
replace_in_files "#8a8a8a" "var(--semantic-text-tertiary)" "Medium gray text (#8a8a8a)"
replace_in_files "#8A8A8A" "var(--semantic-text-tertiary)" "Medium gray text (uppercase)"

# #6a6a6a → var(--semantic-text-secondary)
replace_in_files "#6a6a6a" "var(--semantic-text-secondary)" "Gray text (#6a6a6a)"
replace_in_files "#6A6A6A" "var(--semantic-text-secondary)" "Gray text (uppercase)"

# ============================================================================
# BACKGROUND COLORS
# ============================================================================
echo ""
echo "🎨 Fixing background colors..."

# #f5f5f5 → var(--semantic-surface-base) or var(--semantic-bg-base)
replace_in_files "#f5f5f5" "var(--semantic-surface-base)" "Light background (#f5f5f5)"
replace_in_files "#F5F5F5" "var(--semantic-surface-base)" "Light background (uppercase)"

# #e8e8e8 → var(--semantic-bg-subtle)
replace_in_files "#e8e8e8" "var(--semantic-bg-subtle)" "Subtle background (#e8e8e8)"
replace_in_files "#E8E8E8" "var(--semantic-bg-subtle)" "Subtle background (uppercase)"

# ============================================================================
# GLASSMORPHISM
# ============================================================================
echo ""
echo "✨ Fixing glassmorphism values..."

# rgba(255, 255, 255, 0.8) → var(--glass-white-80)
replace_in_files "rgba(255, 255, 255, 0\\.8)" "var(--glass-white-80)" "Glass white 80%"
replace_in_files "rgba(255,255,255,0\\.8)" "var(--glass-white-80)" "Glass white 80% (no spaces)"

# rgba(255, 255, 255, 0.6) → var(--glass-white-60)
replace_in_files "rgba(255, 255, 255, 0\\.6)" "var(--glass-white-60)" "Glass white 60%"
replace_in_files "rgba(255,255,255,0\\.6)" "var(--glass-white-60)" "Glass white 60% (no spaces)"

# rgba(0, 0, 0, 0.5) → rgba(0, 0, 0, 0.5) (keep - common overlay)
# rgba(0, 0, 0, 0.8) → var(--semantic-overlay-bg) (too specific)

echo ""
echo "✅ Completed! Made approximately $CHANGES replacements."
echo ""
echo "⚠️  NOTE: Some hardcoded colors may be intentional (e.g., user-customizable colors in Brandy app)."
echo "   Please review the changes before committing."

