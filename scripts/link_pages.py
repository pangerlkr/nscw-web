import os

files = [
    "public/Home.html", "public/About.html", "public/Legal_Framework.html", 
    "public/The_Chronicle.html", "public/Connect.html", "public/Support.html", 
    "public/Privacy.html", "public/Reports.html"
]

def replace_links(content):
    # Desktop Nav & Header Links
    content = content.replace('href="#">Introduction</a>', 'href="Home.html">Introduction</a>')
    content = content.replace('href="#">Our Mission</a>', 'href="About.html">Our Mission</a>')
    content = content.replace('href="#">Legal Framework</a>', 'href="Legal_Framework.html">Legal Framework</a>')
    content = content.replace('href="#">Updates</a>', 'href="The_Chronicle.html">Updates</a>')
    content = content.replace('href="#">Connect</a>', 'href="Connect.html">Connect</a>')
    
    # Report an issue button
    content = content.replace('<button class="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-none">', 
                              '<button onclick="window.location.href=\'Connect.html\'" class="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-none hidden sm:block">')
                              
    # Footer Nav Links
    content = content.replace('href="#">Privacy Policy</a>', 'href="Privacy.html">Privacy Policy</a>')
    content = content.replace('href="#">Annual Reports</a>', 'href="Reports.html">Annual Reports</a>')
    content = content.replace('href="#">Contact Us</a>', 'href="Connect.html">Contact Us</a>')
    
    # Fix Home Hero buttons
    if 'View Annual Reports' in content and 'button class="bg-white/10' in content:
        content = content.replace('<button class="bg-white/10', '<button onclick="window.location.href=\'Reports.html\'" class="bg-white/10')
    if 'Start Journey' in content and 'button class="bg-primary-container' in content:
        content = content.replace('<button class="bg-primary-container', '<button onclick="window.location.href=\'About.html\'" class="bg-primary-container')

    return content

for file_path in files:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        new_content = replace_links(content)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        
print("Links updated successfully!")
