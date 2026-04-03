import os

files = [
    "public/Home.html", "public/About.html", "public/Legal_Framework.html", 
    "public/The_Chronicle.html", "public/Connect.html", "public/Support.html", 
    "public/Privacy.html", "public/Reports.html"
]

for file_path in files:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Fix 1: Add pt-32 pb-16 (padding top 8rem, padding bottom 4rem) to all `items-center` sections in hero views
        # Usually they are written as `<section class="relative h-full w-full flex items-center`
        content = content.replace(
            'flex items-center px-6 md:px-12 lg:px-24',
            'flex items-center md:items-end justify-center md:justify-start px-6 md:px-12 lg:px-24 pt-32 md:pt-48 pb-24'
        )
        
        # Specifically for Home.html which has the very large text cut off
        content = content.replace(
            '<div class="relative z-10 max-w-4xl">',
            '<div class="relative z-10 max-w-4xl mt-16 md:mt-32">'
        )
        
        # Ensure that min-h-screen container doesn't overflow weirdly
        content = content.replace(
            '<main class="relative min-h-screen',
            '<main class="relative min-h-[100dvh]'
        )

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

print("Hero layout and top nav-bar collision padding fixed across all pages.")
