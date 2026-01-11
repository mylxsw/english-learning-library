const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(__dirname, '../src/content/entries');
const OUTPUT_FILE = path.join(__dirname, '../src/content/index.json');

// Ensure content directory exists
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  console.log('Created content directory:', CONTENT_DIR);
}

// Read all markdown files
const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md'));

const entries = files.map(filename => {
  const filePath = path.join(CONTENT_DIR, filename);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(fileContent);
  
  // Slug is filename without extension
  const slug = filename.replace(/\.md$/, '');

  return {
    slug,
    ...data
  };
});

// Sort by createdAt descending
entries.sort((a, b) => {
  const dateA = new Date(a.createdAt || 0);
  const dateB = new Date(b.createdAt || 0);
  return dateB - dateA;
});

// Write index file
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(entries, null, 2));

console.log(`Generated index for ${entries.length} entries at ${OUTPUT_FILE}`);
