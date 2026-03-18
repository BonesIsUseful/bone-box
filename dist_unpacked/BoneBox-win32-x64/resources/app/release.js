import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// Get version from command line argument
const NewVersion = process.argv[2];

if (!NewVersion) {
  console.error('❌ Please provide a version number');
  console.log('Usage: npm run release 0.2.1');
  process.exit(1);
}

// Validate version format (Strict Semver, no leading zeros like 0.2.01)
if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(NewVersion)) {
  console.error('❌ Invalid version format. Expected a valid semver (e.g., 0.2.1, no leading zeros).');
  process.exit(1);
}

console.log(`🚀 Starting release process for version ${NewVersion}...`);
console.log('');

// Load GitHub Token
let githubToken = '';
try {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const match = envContent.match(/GITHUB_TOKEN=(.*)/);
  if (match) {
    githubToken = match[1].trim();
  }
} catch (e) {
  console.warn('⚠️  Could not read .env file or missing GITHUB_TOKEN');
}

if (!githubToken || githubToken === 'your_token_here') {
  console.error('❌ ERROR: Please set your GitHub token in .env file (GITHUB_TOKEN=...)');
  process.exit(1);
}

try {
  // 1. Update package.json
  console.log('📝 Updating package.json...');
  const PackageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
  PackageJson.version = NewVersion;
  fs.writeFileSync('package.json', JSON.stringify(PackageJson, null, '\t') + '\n');

  // 2. Update installer.iss
  console.log('📝 Updating installer.iss...');
  let InstallerContent = fs.readFileSync('installer.iss', 'utf-8');
  InstallerContent = InstallerContent.replace(
    /AppVersion=\d+(\.\d+)*/,
    `AppVersion=${NewVersion}`
  );
  InstallerContent = InstallerContent.replace(
    /OutputBaseFilename=BoneBox - [0-9.]+ \(Setup\)/,
    `OutputBaseFilename=BoneBox - ${NewVersion} (Setup)`
  );
  fs.writeFileSync('installer.iss', InstallerContent);

  // 3. Update EditorConfig.ts
  console.log('📝 Updating EditorConfig.ts...');
  let EditorConfigContent = fs.readFileSync('editor/EditorConfig.ts', 'utf-8');
  EditorConfigContent = EditorConfigContent.replace(
    /(public static readonly version: string = .*?)"[0-9.]+"/,
    `$1"${NewVersion}"`
  );
  fs.writeFileSync('editor/EditorConfig.ts', EditorConfigContent);

  // 4. Git commit
  console.log('📦 Staging & Committing changes...');
  execSync('git add package.json installer.iss editor/EditorConfig.ts', { stdio: 'inherit' });
  execSync(`git commit -m "Release v${NewVersion}"`, { stdio: 'inherit' });

  // 5. Create git tag
  console.log('🏷️  Creating git tag...');
  execSync(`git tag v${NewVersion}`, { stdio: 'inherit' });

  // 6. Push to GitHub
  console.log('📤 Pushing commits and tags to GitHub...');
  // Temporarily set remote url to include token for pushed auth
  const remoteUrl = `https://${githubToken}@github.com/BonesIsUseful/bone-box.git`;
  execSync(`git remote set-url origin ${remoteUrl}`);
  
  execSync('git push origin main', { stdio: 'inherit' });
  execSync(`git push origin v${NewVersion}`, { stdio: 'inherit' });

  // Clean up remote URL
  execSync(`git remote set-url origin https://github.com/BonesIsUseful/bone-box.git`);

  // 7. Build, Package and Publish
  console.log('🔨 Building and Publishing with electron-builder...');
  const envClone = Object.assign({}, process.env, { GH_TOKEN: githubToken });
  execSync('npm run build', { stdio: 'inherit' });
  execSync('npx electron-builder --win --publish always', { 
    stdio: 'inherit',
    env: envClone
  });

  console.log('');
  console.log('✅ Release v' + NewVersion + ' complete!');
  console.log(`🎉 App version ${NewVersion} has been built and pushed to GitHub Releases!`);
  console.log(`📡 Auto-updater will now be able to find this version.`);

} catch (error) {
  console.error('❌ Error during release:', error.message);
  // Reset remote URL just in case
  try {
      execSync(`git remote set-url origin https://github.com/BonesIsUseful/bone-box.git`);
  } catch(e) {}
  process.exit(1);
}
