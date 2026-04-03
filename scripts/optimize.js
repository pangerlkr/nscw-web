#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const files = [
  'public/Home.html',
  'public/About.html',
  'public/Legal_Framework.html',
  'public/The_Chronicle.html',
  'public/Connect.html',
  'public/Support.html',
  'public/Privacy.html',
  'public/Reports.html',
];

const aieoTemplate = `
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
`;

const mobileMenuJs = `
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
`;

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Extract title
  const titleMatch = content.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : 'Empowering Women';

  // Inject SEO & AiEO
  if (!content.includes('application/ld+json')) {
    const headInjection = aieoTemplate.replace(/\{title\}/g, title);
    content = content.replace('</head>', headInjection + '\n</head>');
  }

  // Inject Mobile Nav Script
  if (!content.includes('mobile-menu-btn')) {
    content = content.replace('</body>', mobileMenuJs + '\n</body>');
  }

  // Basic responsiveness global replacements
  content = content.replace(/px-12 md:px-24/g, 'px-6 md:px-12 lg:px-24');
  content = content.replace(/px-12 py-8/g, 'px-6 md:px-12 py-4 md:py-8');
  content = content.replace(/px-12 py-16/g, 'px-6 md:px-12 py-8 md:py-16');
  content = content.replace(/text-5xl md:text-7xl/g, 'text-4xl sm:text-5xl md:text-7xl');
  content = content.replace(/h-screen/g, 'min-h-screen');

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('AiEO, SEO and Mobile Device Optimizations have been applied to all HTML pages.');
