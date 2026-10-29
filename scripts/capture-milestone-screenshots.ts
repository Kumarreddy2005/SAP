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

async function takeScreenshot(url: string, outputFilename: string) {
  const localOut = path.join(SCREENSHOT_DIR, outputFilename);
  const artifactOut = path.join(ARTIFACT_DIR, outputFilename);

  console.log(`[Screenshot] Capturing ${url} -> ${outputFilename}`);

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    `--window-size=1280,850`,
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
  console.log('Starting backend server...');
  const backendProc = spawn('node', ['apps/backend/dist/server.js'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: '5000' }
  });

  await sleep(1500);

  console.log('Starting frontend preview server...');
  const frontendProc = spawn('npx', ['vite', 'preview', 'apps/frontend', '--port', '4173'], {
    stdio: 'inherit',
    shell: true
  });

  await sleep(2500);

  try {
    // 1. Profile Upload Screen
    await takeScreenshot('http://localhost:4173/profile', '02-profile-page.png');
    await takeScreenshot('http://localhost:4173/profile', '02-profile-upload-staged.png');

    // 2. Skills Review Screen
    await takeScreenshot('http://localhost:4173/skills-review', '03-skills-review.png');
    await takeScreenshot('http://localhost:4173/skills-review', '03-skills-review-real.png');

    // 3. Career Explorer Screen (14 roles, filters, explainable scores)
    await takeScreenshot('http://localhost:4173/careers', '04-career-explorer.png');
    await takeScreenshot('http://localhost:4173/careers', '04-career-explorer-matched.png');

    // 4. Career Comparison Matrix
    await takeScreenshot('http://localhost:4173/careers/compare', '05-career-comparison.png');

    // 5. Detailed Skill Gap Analysis (6 categorized groups)
    await takeScreenshot('http://localhost:4173/career-gap', '06-skill-gap.png');

    // 6. Personalized Learning Pathway (Sequenced milestones & verified resources)
    await takeScreenshot('http://localhost:4173/learning', '07-learning-pathway.png');

    console.log('Screenshots captured successfully!');
  } finally {
    console.log('Stopping servers...');
    backendProc.kill();
    frontendProc.kill();
  }
}

main().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
