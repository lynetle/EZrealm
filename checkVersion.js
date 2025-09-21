const fs = require('fs');
const fetch = require('node-fetch');

const repo = process.env.TARGET_REPO || 'other-user/other-repo'; // 目标仓库
const filePath = 'your-text.txt'; // 存储版本号的文本

async function main() {
  const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
  if (!res.ok) throw new Error(`获取版本失败: ${res.status}`);
  const data = await res.json();
  const latestVersion = data.tag_name;

  let currentVersion = '';
  if (fs.existsSync(filePath)) {
    currentVersion = fs.readFileSync(filePath, 'utf8').trim();
  }

  if (currentVersion !== latestVersion) {
    console.log(`版本变动: ${currentVersion || '无'} -> ${latestVersion}`);
    fs.writeFileSync(filePath, latestVersion, 'utf8');
  } else {
    console.log('版本号未变动。');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
