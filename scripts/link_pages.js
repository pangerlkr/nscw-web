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

function replaceLinks(content) {
  // Desktop Nav & Header Links
  content = content.replace(/href="#">Introduction<\/a>/g, 'href="Home.html">Introduction</a>');
  content = content.replace(/href="#">Our Mission<\/a>/g, 'href="About.html">Our Mission</a>');
  content = content.replace(/href="#">Legal Framework<\/a>/g, 'href="Legal_Framework.html">Legal Framework</a>');
  content = content.replace(/href="#">Updates<\/a>/g, 'href="The_Chronicle.html">Updates</a>');
  content = content.replace(/href="#">Connect<\/a>/g, 'href="Connect.html">Connect</a>');

  // Report an issue button
  content = content.replace(
    '<button class="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-none">',
    "<button onclick=\"window.location.href='Connect.html'\" class=\"bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-none hidden sm:block\">"
  );

  // Footer Nav Links
  content = content.replace(/href="#">Privacy Policy<\/a>/g, 'href="Privacy.html">Privacy Policy</a>');
  content = content.replace(/href="#">Annual Reports<\/a>/g, 'href="Reports.html">Annual Reports</a>');
  content = content.replace(/href="#">Contact Us<\/a>/g, 'href="Connect.html">Contact Us</a>');

  // Fix Home Hero buttons
  if (content.includes('View Annual Reports') && content.includes('button class="bg-white/10')) {
    content = content.replace(
      '<button class="bg-white/10',
      "<button onclick=\"window.location.href='Reports.html'\" class=\"bg-white/10"
    );
  }
  if (content.includes('Start Journey') && content.includes('button class="bg-primary-container')) {
    content = content.replace(
      '<button class="bg-primary-container',
      "<button onclick=\"window.location.href='About.html'\" class=\"bg-primary-container"
    );
  }

  return content;
}

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  const newContent = replaceLinks(content);
  fs.writeFileSync(filePath, newContent, 'utf8');
}

console.log('Links updated successfully!');
