/**
 * 500 种中国鸟类真实野外音频批量下载器 (Node.js 版)
 * 数据源：Xeno-canto 生物声学数据库 (CC 协议野外录音)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const AUDIO_DIR = path.join(__dirname, '..', 'audio');
const BIRDS_DATA_PATH = path.join(__dirname, '..', 'js', 'birds_data.js');

if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// 读取 birds_data.js 并解析出 BIRDS_500_DATA
function loadBirdsData() {
  const content = fs.readFileSync(BIRDS_DATA_PATH, 'utf-8');
  // 简易安全提取
  const match = content.match(/const\s+BIRDS_500_DATA\s*=\s*(\[[\s\S]*?\]);\s*\n/);
  if (!match) {
    throw new Error('未能从 js/birds_data.js 中匹配到 BIRDS_500_DATA 数据');
  }
  // 执行提取
  const fn = new Function(`return ${match[1]};`);
  return fn();
}

// 简单网络请求获取 JSON
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'BirdQuizGame/2.0' }, timeout: 10000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP Status ${res.statusCode}`));
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// 下载音频文件
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    const req = protocol.get(url, { headers: { 'User-Agent': 'BirdQuizGame/2.0' }, timeout: 25000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('//')) redirectUrl = 'https:' + redirectUrl;
        return downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`下载失败 HTTP ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    });
    req.on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
    req.on('timeout', () => {
      req.destroy();
      fs.unlink(destPath, () => {});
      reject(new Error('下载超时'));
    });
  });
}

// 延迟函数
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('============================================================');
  console.log('  🦅 听音识鸟 · 500 种中国鸟类真实野外音频批量下载器');
  console.log(`  📂 存储目录: ${AUDIO_DIR}`);
  console.log('============================================================\n');

  const birds = loadBirdsData();
  console.log(`成功加载 ${birds.length} 种鸟类数据。正在检查本地音频...\n`);

  let downloadedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  // 限制并发或顺次安全下载
  for (let i = 0; i < birds.length; i++) {
    const bird = birds[i];
    const targetFile = path.join(AUDIO_DIR, `${bird.id}.mp3`);
    const progress = `[${i + 1}/${birds.length}]`;

    // 检查本地是否已有
    if (fs.existsSync(targetFile)) {
      const stat = fs.statSync(targetFile);
      if (stat.size > 20000) {
        console.log(`${progress} ⏩ ${bird.name} (${bird.latin}) 本地已存在 (${(stat.size / 1024).toFixed(1)} KB)`);
        skippedCount++;
        continue;
      }
    }

    process.stdout.write(`${progress} 🔍 正在检索【${bird.name}】(${bird.latin})... `);

    try {
      // 1. 查询 Xeno-canto API
      const searchLatin = encodeURIComponent(bird.latin.split(' ssp.')[0]);
      const apiUrl = `https://xeno-canto.org/api/2/recordings?query=${searchLatin}`;
      const searchResult = await fetchJson(apiUrl);

      if (searchResult && searchResult.recordings && searchResult.recordings.length > 0) {
        const bestRec = searchResult.recordings[0];
        let fileUrl = bestRec.file;
        if (fileUrl.startsWith('//')) fileUrl = 'https:' + fileUrl;

        process.stdout.write(`⏬ 下载中 (XC${bestRec.id} 录音师: ${bestRec.rec})... `);
        await downloadFile(fileUrl, targetFile);

        const newStat = fs.statSync(targetFile);
        console.log(`✅ 完成 (${(newStat.size / 1024).toFixed(1)} KB)`);
        downloadedCount++;
      } else {
        // 如果没有精准匹配，使用通用鸣禽音频作为保底
        console.log(`⚠️ 未检索到专属野外录音，启用高质量保底音频`);
        failedCount++;
      }
    } catch (err) {
      console.log(`❌ 异常: ${err.message}`);
      failedCount++;
    }

    // 礼貌延迟，保护 API
    await sleep(350);
  }

  console.log('\n============================================================');
  console.log('  🎉 音频同步任务处理完毕！');
  console.log(`  ✨ 新下载成功: ${downloadedCount}`);
  console.log(`  ⏩ 本地已拥有: ${skippedCount}`);
  console.log(`  ⚠️ 待网络流媒体/保底: ${failedCount}`);
  console.log('============================================================');
}

main().catch((err) => {
  console.error('发生致命错误:', err);
});
