import os
import re

# Mapping of file names to clean URL slugs
url_map = {
    "public/Home.html": "/",
    "public/About.html": "/about",
    "public/Legal_Framework.html": "/legal-framework",
    "public/The_Chronicle.html": "/updates",
    "public/Connect.html": "/connect",
    "public/Support.html": "/support",
    "public/Privacy.html": "/privacy",
    "public/Reports.html": "/reports"
}

files_to_process = list(url_map.keys())

def migrate_content(content):
    # 1. Update href attributes
    for html_file, slug in url_map.items():
        base_file = os.path.basename(html_file)
        content = re.sub(f'href=["\']{base_file}["\']', f'href="{slug}"', content)
        
    # 2. Update window.location.href in JS redirects
    for html_file, slug in url_map.items():
        base_file = os.path.basename(html_file)
        pattern = r"window\.location\.href=['\"].*?" + re.escape(base_file) + r"['\"]"
        content = re.sub(pattern, f"window.location.href='{slug}'", content)
        
        # Also clean up previously incorrectly migrated slugs
        pattern_broken = r"window\.location\.href=[\"\']" + re.escape(slug) + r"[\"\']"
        content = re.sub(pattern_broken, f"window.location.href='{slug}'", content)

    return content

for filename in files_to_process:
    if os.path.exists(filename):
        with open(filename, "r", encoding="utf-8") as f:
            content = f.read()

        new_content = migrate_content(content)
        
        with open(filename, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Fixed links and JS redirects in {filename}")

print("\nInternal links successfully migrated to clean URLs.")
