import os
import re

files = [
    "public/Home.html", "public/About.html", "public/Legal_Framework.html", 
    "public/The_Chronicle.html", "public/Connect.html", "public/Support.html", 
    "public/Privacy.html", "public/Reports.html"
]

aieo_template = """
<!-- SEO & AiEO Optimizations -->
<meta name="description" content="Nagaland State Commission for Women. Empowering women, advancing Nagaland through legal frameworks, support directories, and social equity." />
<meta name="keywords" content="Nagaland, Women, Commission, Empowerment, Equality, NSCW, Legal Framework, Support" />
<meta property="og:title" content="NSCW Nagaland | {title}" />
<meta property="og:description" content="Nagaland State Commission for Women. Empowering women, advancing Nagaland." />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "GovernmentOrganization",
  "name": "Nagaland State Commission for Women",
  "url": "https://nscw.nagaland.gov.in/",
  "description": "Documenting progress, defending rights, and curating the future of equity across the hills of our vibrant state.",
  "sameAs": [
    "https://facebook.com/nscw",
    "https://twitter.com/nscw"
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "{title}",
  "description": "Nagaland State Commission for Women - {title}"
}
</script>
<!-- End SEO & AiEO -->
"""

mobile_menu_js = """
<!-- Mobile Nav & Optimization Script -->
<script>
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Hamburger Menu setup
    const nav = document.querySelector('nav');
    if (nav && !document.getElementById('mobile-menu-btn')) {
        const btn = document.createElement('button');
        btn.id = 'mobile-menu-btn';
        btn.className = 'md:hidden text-teal-100 p-2 material-symbols-outlined ml-auto mr-4';
        btn.innerText = 'menu';
        
        const desktopMenu = nav.querySelector('.hidden.md\\\\:flex');
        
        if (desktopMenu) {
            // Setup mobile overlay menu
            const mobileMenu = desktopMenu.cloneNode(true);
            mobileMenu.className = 'hidden absolute top-[100%] left-0 w-full bg-teal-950/95 backdrop-blur-xl flex flex-col p-8 gap-6 border-t border-white/10 shadow-2xl z-50';
            nav.appendChild(mobileMenu);
            
            // Insert button before the report issue button if exists
            const ctaBtn = nav.querySelector('button.bg-primary');
            if (ctaBtn) {
                nav.insertBefore(btn, ctaBtn);
                ctaBtn.classList.add('hidden', 'sm:block'); // Hide CTA on very small screens to save space
            } else {
                nav.appendChild(btn);
            }
            
            btn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                btn.innerText = mobileMenu.classList.contains('hidden') ? 'menu' : 'close';
            });
        }
    }
});
</script>
"""

for file_path in files:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Extract title
        title_match = re.search(r"<title>(.*?)</title>", content)
        title = title_match.group(1) if title_match else "Empowering Women"
        
        # Inject SEO & AiEO
        if "application/ld+json" not in content:
            head_injection = aieo_template.replace("{title}", title)
            content = content.replace("</head>", head_injection + "\n</head>")
            
        # Inject Mobile Nav Script
        if "mobile-menu-btn" not in content:
            content = content.replace("</body>", mobile_menu_js + "\n</body>")

        # Basic responsiveness global replacements
        content = content.replace('px-12 md:px-24', 'px-6 md:px-12 lg:px-24')
        content = content.replace('px-12 py-8', 'px-6 md:px-12 py-4 md:py-8')
        content = content.replace('px-12 py-16', 'px-6 md:px-12 py-8 md:py-16')
        content = content.replace('text-5xl md:text-7xl', 'text-4xl sm:text-5xl md:text-7xl')
        content = content.replace('h-screen', 'min-h-screen') 
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
            
print("AiEO, SEO and Mobile Device Optimizations have been applied to all HTML pages.")
