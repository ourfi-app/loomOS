#!/usr/bin/env python3
"""
Split globals.css into smaller, more maintainable files.
"""

import re
from pathlib import Path

# Read globals.css
globals_path = Path('app/globals.css')
content = globals_path.read_text()

# Create output directory
output_dir = Path('app/styles/loomos')
output_dir.mkdir(parents=True, exist_ok=True)

# Extract CSS variables (theme colors)
variables_pattern = r'(@layer base \{[\s\S]*?:root \{[\s\S]*?\n  \}[\s\S]*?\.dark \{[\s\S]*?\n  \}[\s\S]*?\})'
variables_match = re.search(variables_pattern, content)
if variables_match:
    variables_content = variables_match.group(1)
    (output_dir / 'variables.css').write_text(f"""/* loomOS Theme Variables */
{variables_content}
""")
    print("✓ Created variables.css")

# Extract base typography and focus styles
base_pattern = r'(@layer base \{[\s\S]*?\* \{[\s\S]*?@apply[\s\S]*?\}[\s\S]*?body \{[\s\S]*?@apply[\s\S]*?\}[\s\S]*?\/\* Typography[\s\S]*?\}[\s\S]*?\/\* Enhanced Keyboard Navigation[\s\S]*?\.sr-only-focusable:active \{[\s\S]*?\}[\s\S]*?\})'
base_match = re.search(base_pattern, content)
if base_match:
    base_content = base_match.group(1)
    # Skip the variables section we already extracted
    if ':root {' not in base_content or base_content.find('* {') < base_content.find(':root {'):
        (output_dir / 'base.css').write_text(f"""/* loomOS Base Styles */
{base_content}
""")
        print("✓ Created base.css")

# Extract all animations
animations = []
animation_pattern = r'(@keyframes\s+[\w-]+\s*\{[\s\S]*?\n  \})'
for match in re.finditer(animation_pattern, content):
    animations.append(match.group(1))

if animations:
    animations_content = '\n\n'.join(animations)
    (output_dir / 'animations.css').write_text(f"""/* loomOS Animations */
@layer components {{
{animations_content}
}}
""")
    print(f"✓ Created animations.css ({len(animations)} animations)")

# Extract WebOS components
components_sections = {
    'cards': [
        'loomos-multitasking-container',
        'loomos-cards-stage',
        'loomos-app-card',
        'loomos-resize-handle',
        'loomos-app-card-header',
        'loomos-app-card-body',
        'loomos-multitasking-indicator',
    ],
    'dock': [
        'loomos-app-dock',
        'loomos-dock-',
        'loomos-pebble',
    ],
    'status-bar': [
        'loomos-status-bar',
    ],
    'layout': [
        'loomos-container',
        'loomos-touchscreen',
        'loomos-multi-pane',
        'loomos-pane',
    ],
    'search': [
        'loomos-universal-search',
        'loomos-search-',
    ],
    'lists': [
        'loomos-header',
        'loomos-footer',
        'loomos-toolbar',
        'loomos-list-',
    ],
    'utilities': [
        'loomos-text',
        'loomos-badge',
        'loomos-orange',
        'loomos-active',
        'loomos-hover',
        'loomos-divider',
        'loomos-avatar',
        'loomos-card',
    ],
}

# Extract component CSS
component_pattern = r'(@layer components \{[\s\S]*?\})'
component_matches = re.finditer(component_pattern, content)

for match in component_matches:
    component_block = match.group(1)
    
    # Try to categorize and split by component type
    for category, selectors in components_sections.items():
        category_css = []
        for selector in selectors:
            # Find all rules for this selector
            selector_pattern = rf'(\.{re.escape(selector)}[^\{{]*\{{[^\}}]*\}})'
            for rule_match in re.finditer(selector_pattern, component_block):
                rule = rule_match.group(1)
                if rule not in category_css:
                    category_css.append(rule)
        
        if category_css:
            category_content = '\n\n'.join(category_css)
            output_file = output_dir / f'{category}.css'
            
            if output_file.exists():
                # Append to existing
                existing = output_file.read_text()
                output_file.write_text(f"{existing}\n\n{category_content}")
            else:
                # Create new
                output_file.write_text(f"""/* loomOS {category.title()} Styles */
@layer components {{
{category_content}
}}
""")
            print(f"✓ Updated {category}.css")

print("\n✅ CSS splitting complete!")
print(f"📁 Output directory: {output_dir}")
