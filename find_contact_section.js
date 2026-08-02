import fs from 'fs';

// Read the file content
const fileContent = fs.readFileSync('C:/portfolio/assets/MainContainer-CvDghMCY.js', 'utf8');

// Pattern to find - the contact section with all social media links
const pattern = /e\.jsx\(\"div\", { className: \"contact-box\", children:\s*\[e\.jsx\(\"h4\", { children: \"Social\" }\),/;

// Find the matching lines
const lines = fileContent.split('\n');
let found = false;
let resultLines = [];
let braceCount = 0;
let lineCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (found) {
    resultLines.push(line);
    
    // Count braces to track when we've found the complete section
    braceCount += (line.match(/\{/g) || []).length;
    braceCount -= (line.match(/\}/g) || []).length;
    
    if (braceCount <= 0 && i > lineCount + 20) {
      break;
    }
    
    lineCount = i;
  }
  
  if (line.includes('contact-box') && line.includes('Social') && !found) {
    found = true;
    resultLines.push(line);
  }
}

console.log('Found section:');
console.log(resultLines.join('\n'));