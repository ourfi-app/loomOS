# Git Best Practices for Community Manager

This document outlines best practices for maintaining a clean and efficient Git repository.

## Repository Hygiene

### File Size Guidelines

**Images:**
- **Optimize before committing**: Images should be compressed and sized appropriately
- **Maximum recommended size**: 500KB for most images, 2MB absolute maximum
- **Background images**: Should be optimized for web (use JPEG at 85% quality for photos)
- **Logos and icons**: Use SVG when possible, or PNG with appropriate compression

**Large Files:**
- Files over 5MB should be carefully reviewed before committing
- GitHub warns about files over 50MB
- Consider using Git LFS for truly large assets (>5MB)

### What NOT to Commit

**Never commit:**
- ❌ Environment variables (`.env`, `.env.local`, etc.)
- ❌ Secrets, keys, certificates (`.pem`, `.key`, credentials files)
- ❌ Node modules (`node_modules/`)
- ❌ Build artifacts (`.next`, `dist`, `out`)
- ❌ IDE settings (`.vscode/`, `.idea/`) - except shared project settings
- ❌ OS files (`.DS_Store`, `Thumbs.db`)
- ❌ Log files (`*.log`)
- ❌ Database files (`*.sqlite`, `*.db`)
- ❌ Temporary files (`*.tmp`, `*.bak`, `*-backup.*`)
- ❌ Original/backup versions of optimized files

**Review carefully before committing:**
- ⚠️ Large images (>1MB)
- ⚠️ PDF files
- ⚠️ Design source files (`.psd`, `.ai`, `.sketch`)
- ⚠️ Video or audio files
- ⚠️ Binary dependencies

## Git Configuration Files

### .gitignore
The `.gitignore` file prevents accidentally committing unwanted files.

**Current configuration prevents:**
- Dependencies and build outputs
- Environment variables and secrets
- Temporary and backup files
- IDE and OS-specific files
- Large design files
- Database files

**To add new patterns:**
```bash
# Add to .gitignore
echo "pattern-to-ignore" >> .gitignore
git add .gitignore
git commit -m "chore: update gitignore"
```

### .gitattributes
The `.gitattributes` file ensures consistent file handling across platforms.

**Current configuration handles:**
- Line ending normalization (LF for consistency)
- Binary file detection
- Language statistics for GitHub
- Prepared for Git LFS (when needed)

## Optimizing Images

### Before Committing Images

**Option 1: Using Python (Pillow)**
```python
from PIL import Image

# Open and optimize
img = Image.open('large-image.png')
img = img.resize((1920, 1080), Image.Resampling.LANCZOS)
img.save('optimized-image.jpg', 'JPEG', quality=85, optimize=True)
```

**Option 2: Using ImageMagick**
```bash
# Convert and compress
convert input.png -resize 1920x -quality 85 output.jpg
```

**Option 3: Using online tools**
- [TinyPNG](https://tinypng.com/) - PNG/JPEG compression
- [Squoosh](https://squoosh.app/) - Image optimization
- [ImageOptim](https://imageoptim.com/) - Mac app for optimization

### Image Format Guidelines

| Use Case | Recommended Format | Max Size | Notes |
|----------|-------------------|----------|-------|
| Photos/backgrounds | JPEG | 500KB | Quality: 85% |
| Logos/icons | SVG | N/A | Vector preferred |
| Screenshots | PNG | 300KB | Compress with tools |
| Thumbnails | JPEG/WebP | 50KB | Small dimensions |
| Design assets | SVG/PNG | 200KB | Use SVG when possible |

## Commit Best Practices

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(auth): add Google SSO integration"
git commit -m "fix(api): resolve CORS issue in marketplace endpoint"
git commit -m "docs: update deployment guide with Render instructions"
git commit -m "perf(images): optimize background image from 22MB to 310KB"
git commit -m "chore: remove obsolete session documentation files"
```

### Commit Frequency
- Commit logical units of work
- Don't commit broken code
- Don't commit commented-out code
- Review changes before committing: `git diff`

## Cleaning Up Repository History

### Checking Repository Size
```bash
# Check total repo size
du -sh .git

# Find large files in history
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  sed -n 's/^blob //p' | \
  sort --numeric-sort --key=2 | \
  tail -n 20
```

### If You Accidentally Committed Large Files

**Option 1: Before pushing (easiest)**
```bash
# Remove from last commit
git rm --cached large-file.png
git commit --amend -m "chore: remove large file"
```

**Option 2: After pushing (requires coordination)**
```bash
# Use git-filter-repo (recommended)
pip install git-filter-repo
git filter-repo --path large-file.png --invert-paths

# Or BFG Repo-Cleaner
java -jar bfg.jar --delete-files large-file.png
```

⚠️ **Warning**: Rewriting history affects all team members. Coordinate before doing this!

## Git LFS (Large File Storage)

For projects that truly need large files, use Git LFS:

### Setup Git LFS
```bash
# Install Git LFS
git lfs install

# Track large file types
git lfs track "*.psd"
git lfs track "*.ai"
git lfs track "*.mp4"

# Add .gitattributes
git add .gitattributes
git commit -m "chore: configure Git LFS"
```

### When to Use Git LFS
- Design source files (Photoshop, Illustrator, Sketch)
- Large images that can't be optimized further
- Video files for documentation
- Large binary assets

### When NOT to Use Git LFS
- Regular images (optimize them instead)
- Source code
- Documentation
- Small binary files (<1MB)

## Pre-Commit Hooks

Consider adding pre-commit hooks to prevent issues:

### Install pre-commit
```bash
npm install --save-dev husky lint-staged

# In package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{md,json}": ["prettier --write"],
    "*.{png,jpg,jpeg}": ["imagemin-lint-staged"]
  }
}
```

## Checking Before You Commit

**Quick checklist:**
```bash
# 1. Review your changes
git status
git diff

# 2. Check file sizes
git ls-files -z | xargs -0 du -h | sort -h | tail -20

# 3. Look for sensitive data
git diff | grep -i "password\|secret\|key\|token"

# 4. Verify build passes
npm run build
npm run lint

# 5. Commit
git add .
git commit -m "type: description"
```

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Best Practices](https://docs.github.com/en/get-started/using-git/about-git)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git LFS](https://git-lfs.github.com/)
- [Pro Git Book](https://git-scm.com/book/en/v2)

## Questions?

If you're unsure about committing something:
1. Check this guide
2. Ask in team chat
3. Review with a senior developer
4. When in doubt, don't commit large/sensitive files

---

**Remember**: It's easier to prevent issues than to fix them after they're in history!
