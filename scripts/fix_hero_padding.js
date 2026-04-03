#!/usr/bin/env node
'use strict';

const fs = require('fs');

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

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix 1: Add pt-32 pb-16 (padding top 8rem, padding bottom 4rem) to all `items-center` sections in hero views
  // Usually they are written as `<section class="relative h-full w-full flex items-center`
  content = content.replace(
    /flex items-center px-6 md:px-12 lg:px-24/g,
    'flex items-center md:items-end justify-center md:justify-start px-6 md:px-12 lg:px-24 pt-32 md:pt-48 pb-24'
  );

  // Specifically for Home.html which has the very large text cut off
  content = content.replace(
    '<div class="relative z-10 max-w-4xl">',
    '<div class="relative z-10 max-w-4xl mt-16 md:mt-32">'
  );

  // Ensure that min-h-screen container doesn't overflow weirdly
  content = content.replace(
    /<main class="relative min-h-screen/g,
    '<main class="relative min-h-[100dvh]'
  );

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('Hero layout and top nav-bar collision padding fixed across all pages.');
