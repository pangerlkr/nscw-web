#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const urlMap = {
  'public/Home.html': '/',
  'public/About.html': '/about',
  'public/Legal_Framework.html': '/legal-framework',
  'public/The_Chronicle.html': '/updates',
  'public/Connect.html': '/connect',
  'public/Support.html': '/support',
  'public/Privacy.html': '/privacy',
  'public/Reports.html': '/reports',
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function migrateContent(content) {
  // 1. Update href attributes
  for (const [htmlFile, slug] of Object.entries(urlMap)) {
    const baseFile = path.basename(htmlFile);
    content = content.replace(
      new RegExp(`href=["']${escapeRegex(baseFile)}["']`, 'g'),
      `href="${slug}"`
    );
  }

  // 2. Update window.location.href in JS redirects
  for (const [htmlFile, slug] of Object.entries(urlMap)) {
    const baseFile = path.basename(htmlFile);
    content = content.replace(
      new RegExp(`window\\.location\\.href=['"].*?${escapeRegex(baseFile)}['"]`, 'g'),
      `window.location.href='${slug}'`
    );

    // Also clean up previously incorrectly migrated slugs
    content = content.replace(
      new RegExp(`window\\.location\\.href=["']${escapeRegex(slug)}["']`, 'g'),
      `window.location.href='${slug}'`
    );
  }

  return content;
}

for (const filename of Object.keys(urlMap)) {
  if (!fs.existsSync(filename)) continue;

  let content = fs.readFileSync(filename, 'utf8');
  const newContent = migrateContent(content);
  fs.writeFileSync(filename, newContent, 'utf8');
  console.log(`Fixed links and JS redirects in ${filename}`);
}

console.log('\nInternal links successfully migrated to clean URLs.');
