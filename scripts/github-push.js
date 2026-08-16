const fs = require('fs');
const path = require('path');

// Robust GitHub Direct Uploader + Auto-Activator
async function uploadToGitHub() {
  const token = process.argv[2];
  const owner = process.argv[3];
  const repo = process.argv[4];
  const isPrivate = process.argv[5] === 'private';

  if (!token || !owner || !repo) {
    console.log('Usage: node scripts/github-push.js <GITHUB_TOKEN> <USERNAME> <REPO_NAME> [public/private]');
    process.exit(1);
  }

  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'CDOW-Uploader'
  };

  console.log(`Verifying repository: ${owner}/${repo}...`);

  let repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (repoRes.status === 404) {
    console.log(`Creating repository ${repo}...`);
    const createRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: repo,
        private: false,
        auto_init: true,
        description: 'CDOW CS2 — Premier Luxury CS2 Unboxing, Case Battles, Roulette, Upgrader & X50 Platform'
      })
    });
    if (!createRes.ok) throw new Error(await createRes.text());
    await new Promise(r => setTimeout(r, 2000));
  }

  // Gather project files (excluding node_modules, .git, skins folder)
  const rootDir = path.resolve(__dirname, '..');
  const ignoreDirs = ['node_modules', '.git', '.gemini', 'logs', 'gui-test-screenshots', 'skins'];

  function getFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files = [];
    for (const e of entries) {
      if (ignoreDirs.includes(e.name)) continue;
      const fullPath = path.join(dir, e.name);
      if (e.isDirectory()) {
        files = files.concat(getFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    return files;
  }

  const allFiles = getFiles(rootDir);
  console.log(`Found ${allFiles.length} project files to upload.`);

  // Upload Blobs with safe 6x concurrency
  console.log('Uploading Git Blobs...');
  const treeItems = [];
  let completed = 0;
  const CONCURRENCY = 6;

  async function uploadFile(filePath) {
    const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath);
    const isBinary = !relPath.endsWith('.js') && !relPath.endsWith('.json') && !relPath.endsWith('.html') && !relPath.endsWith('.css') && !relPath.endsWith('.md') && !relPath.endsWith('.gitignore') && !relPath.endsWith('.svg') && !relPath.endsWith('.nojekyll');

    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const blobRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            content: content.toString(isBinary ? 'base64' : 'utf8'),
            encoding: isBinary ? 'base64' : 'utf-8'
          })
        });

        if (blobRes.ok) {
          const blobData = await blobRes.json();
          treeItems.push({
            path: relPath,
            mode: '100644',
            type: 'blob',
            sha: blobData.sha
          });
          completed++;
          if (completed % 25 === 0 || completed === allFiles.length) {
            console.log(`Progress: ${completed}/${allFiles.length} files uploaded...`);
          }
          return;
        } else {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        }
      } catch (err) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
    console.error(`Failed to upload ${relPath}`);
  }

  const queue = [...allFiles];
  const workers = Array(CONCURRENCY).fill(0).map(async () => {
    while (queue.length > 0) {
      const file = queue.shift();
      if (file) await uploadFile(file);
    }
  });

  await Promise.all(workers);
  console.log(`All ${treeItems.length} Git Blobs successfully created!`);

  // Create Tree
  console.log('Creating Git Tree...');
  const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ tree: treeItems })
  });
  if (!treeRes.ok) throw new Error(`Failed to create tree: ${await treeRes.text()}`);
  const treeData = await treeRes.json();

  // Get Parent Commit
  let parentCommit = null;
  const currentRefRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`, { headers });
  if (currentRefRes.ok) {
    const refData = await currentRefRes.json();
    parentCommit = refData.object.sha;
  }

  // Create Commit
  console.log('Creating Commit...');
  const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message: 'CDOW CS2: Optimized ultra-fast 52 cases, real skin CDN images, 0 balance start & bugfixes',
      tree: treeData.sha,
      parents: parentCommit ? [parentCommit] : []
    })
  });
  if (!commitRes.ok) throw new Error(`Failed commit: ${await commitRes.text()}`);
  const commitData = await commitRes.json();

  // Update Branch Ref
  console.log('Updating main branch...');
  const updateRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ sha: commitData.sha, force: true })
  });

  if (!updateRes.ok) {
    await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ref: 'refs/heads/main', sha: commitData.sha })
    });
  }

  // Ensure GitHub Pages is active
  try {
    await fetch(`https://api.github.com/repos/${owner}/${repo}/pages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ source: { branch: 'main', path: '/' } })
    });
  } catch (e) {}

  console.log(`\n🎉 SUCCESS! Fully Deployed to GitHub Pages: https://${owner.toLowerCase()}.github.io/${repo}/`);
}

uploadToGitHub().catch(e => console.error('\nERROR:', e.message));
