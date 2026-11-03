import { spawn, execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.resolve('screenshots', 'phase-3-after');
const ARTIFACT_DIR = path.resolve('C:\\Users\\kumar\\.gemini\\antigravity\\brain\\05645a34-9b1d-4483-a950-e1f43a4c595a\\screenshots\\phase-3-after');

if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function freePort(port: number) {
  try {
    const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8' });
    const lines = out.trim().split('\n');
    for (const line of lines) {
      if (line.includes('LISTENING')) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0') {
          try { execSync(`taskkill /F /PID ${pid} /T`); } catch {}
        }
      }
    }
  } catch {}
}

async function takeScreenshot(url: string, outputFilename: string, width: number, height: number) {
  const localOut = path.join(SCREENSHOT_DIR, outputFilename);
  const artifactOut = path.join(ARTIFACT_DIR, outputFilename);

  console.log(`[Screenshot] Capturing ${url} (${width}x${height}) -> ${outputFilename}`);

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    `--window-size=${width},${height}`,
    '--virtual-time-budget=3000',
    `--screenshot=${localOut}`,
    url
  ]);

  await new Promise<void>((resolve, reject) => {
    chromeProc.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Chrome exited with code ${code}`));
    });
  });

  if (fs.existsSync(localOut)) {
    fs.copyFileSync(localOut, artifactOut);
    console.log(`[Screenshot] Saved: ${localOut}`);
  }
}

async function main() {
  console.log('Ensuring clean background ports...');
  freePort(5000);
  freePort(4173);
  await sleep(1500);

  console.log('Starting backend server on port 5000...');
  const backendProc = spawn('node', ['apps/backend/dist/server.js'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: '5000' }
  });

  await sleep(2000);

  console.log('Starting frontend preview server on port 4173...');
  const frontendProc = spawn('npx', ['vite', 'preview', 'apps/frontend', '--port', '4173', '--strictPort'], {
    stdio: 'inherit',
    shell: true
  });

  await sleep(3500);

  try {
    // 1. Desktop (1440x900)
    console.log('\n--- Capturing Desktop (1440x900) ---');
    await takeScreenshot('http://localhost:4173/', 'desktop-landing.png', 1440, 900);
    await takeScreenshot('http://localhost:4173/dashboard?mode=demo', 'desktop-dashboard-demo.png', 1440, 900);
    await takeScreenshot('http://localhost:4173/dashboard?mode=empty', 'desktop-dashboard-empty.png', 1440, 900);
    await takeScreenshot('http://localhost:4173/profile', 'desktop-profile.png', 1440, 900);
    await takeScreenshot('http://localhost:4173/skills-review', 'desktop-skills-review.png', 1440, 900);
    await takeScreenshot('http://localhost:4173/careers', 'desktop-careers.png', 1440, 900);
    await takeScreenshot('http://localhost:4173/career-gap', 'desktop-career-gap.png', 1440, 900);
    await takeScreenshot('http://localhost:4173/learning', 'desktop-learning.png', 1440, 900);
    await takeScreenshot('http://localhost:4173/projects', 'desktop-projects.png', 1440, 900);
    await takeScreenshot('http://localhost:4173/readiness', 'desktop-readiness.png', 1440, 900);
    await takeScreenshot('http://localhost:4173/jobs', 'desktop-jobs.png', 1440, 900);

    // 2. Laptop (1280x800)
    console.log('\n--- Capturing Laptop (1280x800) ---');
    await takeScreenshot('http://localhost:4173/', 'laptop-landing.png', 1280, 800);
    await takeScreenshot('http://localhost:4173/dashboard?mode=demo', 'laptop-dashboard.png', 1280, 800);
    await takeScreenshot('http://localhost:4173/careers', 'laptop-careers.png', 1280, 800);
    await takeScreenshot('http://localhost:4173/readiness', 'laptop-readiness.png', 1280, 800);

    // 3. Tablet (768x1024)
    console.log('\n--- Capturing Tablet (768x1024) ---');
    await takeScreenshot('http://localhost:4173/', 'tablet-landing.png', 768, 1024);
    await takeScreenshot('http://localhost:4173/dashboard?mode=demo', 'tablet-dashboard.png', 768, 1024);
    await takeScreenshot('http://localhost:4173/profile', 'tablet-profile.png', 768, 1024);
    await takeScreenshot('http://localhost:4173/readiness', 'tablet-readiness.png', 768, 1024);

    // 4. Mobile (375x812)
    console.log('\n--- Capturing Mobile (375x812) ---');
    await takeScreenshot('http://localhost:4173/', 'mobile-landing.png', 375, 812);
    await takeScreenshot('http://localhost:4173/dashboard?mode=demo', 'mobile-dashboard.png', 375, 812);
    await takeScreenshot('http://localhost:4173/profile', 'mobile-profile.png', 375, 812);
    await takeScreenshot('http://localhost:4173/skills-review', 'mobile-skills-review.png', 375, 812);
    await takeScreenshot('http://localhost:4173/careers', 'mobile-careers.png', 375, 812);
    await takeScreenshot('http://localhost:4173/readiness', 'mobile-readiness.png', 375, 812);

    console.log('\n=== All Phase-3-After screenshots captured successfully! ===\n');
  } finally {
    console.log('Shutting down preview & backend processes...');
    try { backendProc.kill(); } catch {}
    try { frontendProc.kill(); } catch {}
    freePort(5000);
    freePort(4173);
  }
}

main().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
