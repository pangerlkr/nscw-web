#!/usr/bin/env node
'use strict';

const fs = require('fs');

const pageMeta = {
  'public/Home.html': ['Home | Empowering Women', 'Introduction'],
  'public/About.html': ['Our Mission', 'Our Mission'],
  'public/Legal_Framework.html': ['Legal Framework', 'Legal Framework'],
  'public/The_Chronicle.html': ['Updates', 'Updates'],
  'public/Connect.html': ['Connect', 'Connect'],
  'public/Support.html': ['District Directory', 'Support'],
  'public/Privacy.html': ['Privacy Policy', 'Privacy Policy'],
  'public/Reports.html': ['Annual Reports', 'Annual Reports'],
};

const navLinks = {
  Introduction: 'Home.html',
  'Our Mission': 'About.html',
  'Legal Framework': 'Legal_Framework.html',
  Updates: 'The_Chronicle.html',
  Connect: 'Connect.html',
};

const inactiveCls =
  "text-teal-100/80 hover:text-yellow-400 transition-all duration-300 scale-95 duration-200 ease-in-out font-['Plus_Jakarta_Sans'] font-medium tracking-wide";
const activeCls =
  "text-yellow-500 border-b-2 border-yellow-500 pb-1 hover:text-yellow-400 transition-all duration-300 scale-95 duration-200 ease-in-out font-['Plus_Jakarta_Sans'] font-medium tracking-wide";

function updateActiveNav(content, currentFilename) {
  const activeNavName = pageMeta[currentFilename][1];

  const navMatch = content.match(/<div class="hidden md:flex items-center gap-[^>]+">([\s\S]*?)<\/div>/);
  if (navMatch) {
    const oldNavInner = navMatch[1];
    let newNavInner = '';
    for (const [name, link] of Object.entries(navLinks)) {
      if (name === activeNavName) {
        newNavInner += `\n<a class="${activeCls}" href="${link}">${name}</a>`;
      } else {
        newNavInner += `\n<a class="${inactiveCls}" href="${link}">${name}</a>`;
      }
    }
    newNavInner += '\n';
    content = content.replace(oldNavInner, newNavInner);
  }

  return content;
}

for (const [filename, meta] of Object.entries(pageMeta)) {
  if (!fs.existsSync(filename)) continue;

  let content = fs.readFileSync(filename, 'utf8');

  const titleStr = meta[0];

  // Replace the title tag if it exists
  if (content.includes('<title>')) {
    content = content.replace(/<title>.*?<\/title>/, `<title>${titleStr} - NSCW Nagaland</title>`);
  } else {
    content = content.replace('<head>', `<head>\n<title>${titleStr} - NSCW Nagaland</title>`);
  }

  // Fix SEO tags injected previously
  content = content.replace(
    /<meta property="og:title" content="[^"]+" \/>/g,
    `<meta property="og:title" content="${titleStr} - NSCW Nagaland" />`
  );
  content = content.replace(
    /"name": "[^"]+",\n  "description": "Nagaland State Commission/g,
    `"name": "${titleStr} - NSCW Nagaland",\n  "description": "Nagaland State Commission`
  );

  // Make the correct nav item active
  content = updateActiveNav(content, filename);

  // Also clean up the min-min-h-screen bug
  content = content.replace(/min-min-h-screen/g, 'min-h-screen');

  fs.writeFileSync(filename, content, 'utf8');
}

console.log('Metadata, Titles, and Active Navigation states fixed across all pages.');
