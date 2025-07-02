/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Create scripts directory if it doesn't exist
const scriptsDir = path.dirname(__filename);
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

// Create a simple SVG icon with dark background
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#1a1a1a"/>
  <text x="256" y="280" font-family="Arial, sans-serif" font-size="180" font-weight="bold" fill="#f0f2f5" text-anchor="middle">MW</text>
</svg>
`;

const sizes = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
];

async function generateIcons() {
  try {
    const publicDir = path.join(__dirname, '..', 'public');

    // Generate PNG icons from SVG
    for (const { size, name } of sizes) {
      await sharp(Buffer.from(svgIcon))
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, name));

      console.log(`Generated ${name}`);
    }

    // Copy favicon to root
    await sharp(path.join(publicDir, 'favicon-32x32.png')).toFile(
      path.join(publicDir, 'favicon.ico')
    );

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
