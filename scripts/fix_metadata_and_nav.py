import os
import re

page_meta = {
    "public/Home.html": ("Home | Empowering Women", "Introduction"),
    "public/About.html": ("Our Mission", "Our Mission"),
    "public/Legal_Framework.html": ("Legal Framework", "Legal Framework"),
    "public/The_Chronicle.html": ("Updates", "Updates"),
    "public/Connect.html": ("Connect", "Connect"),
    "public/Support.html": ("District Directory", "Support"),
    "public/Privacy.html": ("Privacy Policy", "Privacy Policy"),
    "public/Reports.html": ("Annual Reports", "Annual Reports")
}

def update_active_nav(content, current_filename):
    active_nav_name = page_meta[current_filename][1]
    
    # Standard classes for inactive and active items
    inactive_cls = "text-teal-100/80 hover:text-yellow-400 transition-all duration-300 scale-95 duration-200 ease-in-out font-['Plus_Jakarta_Sans'] font-medium tracking-wide"
    active_cls = "text-yellow-500 border-b-2 border-yellow-500 pb-1 hover:text-yellow-400 transition-all duration-300 scale-95 duration-200 ease-in-out font-['Plus_Jakarta_Sans'] font-medium tracking-wide"
    
    # For each known nav link, we will forcefully rebuild the <div class="hidden md:flex items-center gap-X">
    # Wait, it's safer to just regex replace the specific <a> tags.
    
    nav_links = {
        "Introduction": "Home.html",
        "Our Mission": "About.html",
        "Legal Framework": "Legal_Framework.html",
        "Updates": "The_Chronicle.html",
        "Connect": "Connect.html"
    }
    
    # Strategy: Replace all potential a tag variants inside the header nav.
    # First, let's locate the desktop nav block to be safe.
    nav_match = re.search(r'<div class="hidden md:flex items-center gap-[^>]+>(.*?)</div>', content, flags=re.DOTALL)
    if nav_match:
        old_nav_inner = nav_match.group(1)
        new_nav_inner = ""
        for name, link in nav_links.items():
            if name == active_nav_name:
                new_nav_inner += f'\\n<a class="{active_cls}" href="{link}">{name}</a>'
            else:
                new_nav_inner += f'\\n<a class="{inactive_cls}" href="{link}">{name}</a>'
        new_nav_inner += "\\n"
        content = content.replace(old_nav_inner, new_nav_inner)
    
    return content

for filename, meta in page_meta.items():
    if os.path.exists(filename):
        with open(filename, "r", encoding="utf-8") as f:
            content = f.read()

        title_str = meta[0]
        
        # Replace the title tag if it exists
        if "<title>" in content:
            content = re.sub(r'<title>.*?</title>', f'<title>{title_str} - NSCW Nagaland</title>', content)
        else:
            # Insert title tag
            content = content.replace("<head>", f"<head>\\n<title>{title_str} - NSCW Nagaland</title>")

        # Fix SEO tags injected previously
        content = re.sub(r'<meta property="og:title" content="[^"]+" />', f'<meta property="og:title" content="{title_str} - NSCW Nagaland" />', content)
        content = re.sub(r'"name": "[^"]+",\n  "description": "Nagaland State Commission', f'"name": "{title_str} - NSCW Nagaland",\\n  "description": "Nagaland State Commission', content)
        
        # Make the correct nav item active
        content = update_active_nav(content, filename)
        
        # Also clean up the min-min-h-screen bug
        content = content.replace("min-min-h-screen", "min-h-screen")

        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)

print("Metadata, Titles, and Active Navigation states fixed across all pages.")
