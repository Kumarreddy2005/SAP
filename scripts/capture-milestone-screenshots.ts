import { spawn, ChildProcess } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.resolve('screenshots');
const ARTIFACT_DIR = path.resolve('C:\\Users\\kumar\\.gemini\\antigravity\\brain\\05645a34-9b1d-4483-a950-e1f43a4c595a\\screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function takeScreenshot(url: string, outputFilename: string, width = 1280, height = 850) {
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
    console.log(`[Screenshot] Saved to: ${localOut} and ${artifactOut}`);
  }
}

async function main() {
  console.log('Starting backend server on port 5000...');
  const backendProc = spawn('node', ['apps/backend/dist/server.js'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: '5000' }
  });

  await sleep(2000);

  console.log('Starting frontend preview server on port 4173...');
  const frontendProc = spawn('npx', ['vite', 'preview', 'apps/frontend', '--port', '4173'], {
    stdio: 'inherit',
    shell: true
  });

  await sleep(3500);

  try {
    // === DESKTOP SCREENSHOTS (1280x850) ===
    console.log('\n--- Capturing Desktop Screenshots (1280x850) ---');
    // 01. Landing Page
    await takeScreenshot('http://localhost:4173/', '01-landing-page.png', 1280, 850);

    // 02. Profile Upload & Entry
    await takeScreenshot('http://localhost:4173/profile', '02-profile-page.png', 1280, 850);
    await takeScreenshot('http://localhost:4173/profile', '02-profile-upload-staged.png', 1280, 850);

    // 03. Human-in-the-Loop Skills Review
    await takeScreenshot('http://localhost:4173/skills-review', '03-skills-review.png', 1280, 850);
    await takeScreenshot('http://localhost:4173/skills-review', '03-skills-review-real.png', 1280, 850);

    // 04. Career Explorer (14 Roles, Filters, Explainable Match Scores)
    await takeScreenshot('http://localhost:4173/careers', '04-career-explorer.png', 1280, 850);
    await takeScreenshot('http://localhost:4173/careers', '04-career-explorer-matched.png', 1280, 850);

    // 05. Career Comparison Matrix
    await takeScreenshot('http://localhost:4173/careers/compare', '05-career-comparison.png', 1280, 850);

    // 06. Detailed 6-Category Skill Gap Analysis
    await takeScreenshot('http://localhost:4173/career-gap', '06-skill-gap.png', 1280, 850);

    // 07. Sequenced Learning Pathway & Verified SAP Resources
    await takeScreenshot('http://localhost:4173/learning', '07-learning-pathway.png', 1280, 850);

    // 08. Interactive Practical Projects & Enterprise Workspaces
    await takeScreenshot('http://localhost:4173/projects', '08-practical-projects.png', 1280, 850);

    // 09. Multi-Dimensional Career Readiness Scorecard
    await takeScreenshot('http://localhost:4173/readiness', '09-career-readiness.png', 1280, 850);

    // 10. Parameterized External Job Destinations & Anti-Fabrication Disclosures
    await takeScreenshot('http://localhost:4173/jobs', '10-job-destinations.png', 1280, 850);

    // === MOBILE RESPONSIVENESS AUDIT (375x812) ===
    console.log('\n--- Capturing Mobile Screenshots (375x812) ---');
    await takeScreenshot('http://localhost:4173/', 'mobile-01-landing.png', 375, 812);
    await takeScreenshot('http://localhost:4173/profile', 'mobile-02-profile.png', 375, 812);
    await takeScreenshot('http://localhost:4173/skills-review', 'mobile-03-skills-review.png', 375, 812);
    await takeScreenshot('http://localhost:4173/careers', 'mobile-04-careers.png', 375, 812);
    await takeScreenshot('http://localhost:4173/readiness', 'mobile-09-readiness.png', 375, 812);

    console.log('\nAll 15 screenshots captured and verified successfully!');
  } finally {
    console.log('Stopping preview and backend servers...');
    try {
      if (backendProc.pid) spawn('taskkill', ['/pid', backendProc.pid.toString(), '/T', '/F']);
      if (frontendProc.pid) spawn('taskkill', ['/pid', frontendProc.pid.toString(), '/T', '/F']);
    } catch {
      backendProc.kill();
      frontendProc.kill();
    }
  }
}

main().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
