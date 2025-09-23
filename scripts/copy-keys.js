const fs = require("fs");
const path = require("path");

// Delay (in milliseconds) before running the copy
const DELAY_MS = 10 * 1000; 

function copyKeys() {
  // Source folder (where your keys are now)
  const srcDir = path.join(__dirname, "../keys"); // adjust this path if needed
  // Destination folder (dist)
  const destDir = path.join(__dirname, "../dist", "keys");

  if (!fs.existsSync(srcDir)) {
    console.warn(`Source directory not found: ${srcDir}`);
    return;
  }

  // Ensure destination folder exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Copy all files from keys to dist/keys
  fs.readdirSync(srcDir).forEach((file) => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);

    fs.copyFileSync(srcFile, destFile);
    console.log(`Copied: ${file}`);
  });

  console.log("Copy complete.");
}

console.log(`copy-keys will run in ${Math.round(DELAY_MS / 1000)} seconds...`);
setTimeout(() => {
  try {
    copyKeys();
  } catch (err) {
    console.error("Failed to copy keys:", err);
    process.exitCode = 1;
  }
}, DELAY_MS);
