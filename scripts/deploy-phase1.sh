#!/bin/bash

# Phase 1 Deployment Script
# This script helps deploy Phase 1 multi-tenancy infrastructure

set -e  # Exit on error

echo "🚀 Phase 1 Deployment Helper"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo "ℹ️  $1"
}

# Check if we're on the correct branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "claude/plan-superadmin-features-011CUuWXa4TLeSCMYsSpZ2zA" ]; then
    print_error "Not on the Phase 1 branch!"
    print_info "Current branch: $CURRENT_BRANCH"
    print_info "Expected: claude/plan-superadmin-features-011CUuWXa4TLeSCMYsSpZ2zA"
    exit 1
fi

print_success "On correct branch: $CURRENT_BRANCH"
echo ""

# Check if all commits are pushed
if git status | grep -q "Your branch is ahead"; then
    print_warning "You have unpushed commits!"
    print_info "Run: git push origin $CURRENT_BRANCH"
    echo ""
    read -p "Push now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin "$CURRENT_BRANCH"
        print_success "Commits pushed!"
    else
        print_error "Please push commits before proceeding"
        exit 1
    fi
fi

echo ""
print_success "All commits are pushed!"
echo ""

# Show recent commits
echo "📝 Recent commits on this branch:"
echo "=================================="
git log --oneline -3
echo ""

# Check for Phase 1 commits
if git log --oneline | grep -q "feat: Complete Phase 1"; then
    print_success "Phase 1 commits found!"
else
    print_warning "Phase 1 commits not found. Are you sure this is the right branch?"
fi

echo ""
echo "🎯 Next Steps for Deployment:"
echo "=============================="
echo ""
echo "OPTION 1: Create Pull Request (Recommended)"
echo "  1. Go to: https://github.com/ourfi-app/loomOS"
echo "  2. Click 'Pull Requests' → 'New Pull Request'"
echo "  3. Base: main (or your main branch)"
echo "  4. Compare: $CURRENT_BRANCH"
echo "  5. Create PR and merge when ready"
echo ""
echo "OPTION 2: Merge Directly (Advanced)"
echo "  Run the following commands:"
echo "  $ git checkout main"
echo "  $ git merge $CURRENT_BRANCH"
echo "  $ git push origin main"
echo ""
echo "After merging:"
echo "  1. Render will auto-deploy (if enabled)"
echo "  2. Or manually deploy on Render dashboard"
echo "  3. Run database migration (see guide below)"
echo ""

# Check if deployment guide exists
if [ -f "docs/DEPLOYMENT_GUIDE_PHASE1.md" ]; then
    print_success "Deployment guide available!"
    print_info "Read: docs/DEPLOYMENT_GUIDE_PHASE1.md"
else
    print_warning "Deployment guide not found!"
fi

echo ""
echo "📊 Deployment Checklist:"
echo "========================"
echo "Before deploying, ensure:"
echo "  [ ] All tests passing (run: npx tsx test-phase1-unit.ts)"
echo "  [ ] Code reviewed"
echo "  [ ] Database backup recent"
echo "  [ ] Environment variables ready (NEXT_PUBLIC_APP_DOMAIN)"
echo "  [ ] DNS configuration planned"
echo ""

# Ask if user wants to see deployment guide
echo ""
read -p "View deployment guide? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "docs/DEPLOYMENT_GUIDE_PHASE1.md" ]; then
        cat docs/DEPLOYMENT_GUIDE_PHASE1.md | head -100
        echo ""
        print_info "See full guide: docs/DEPLOYMENT_GUIDE_PHASE1.md"
    fi
fi

echo ""
print_success "Deployment helper complete!"
print_info "Proceed with your chosen deployment option above."
echo ""
