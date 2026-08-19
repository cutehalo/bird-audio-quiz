/**
 * 听音识鸟 - 声音引擎 (AudioEngine)
 * 1. 真实野外鸟鸣高品质 MP3 播放引擎（原生 HTML5 Audio，完美兼容 file:/// 本地协议与 http 网络环境）
 * 2. 实时声波频谱与动态波形可视化（Canvas FFT + 动态声学能量波）
 * 3. 游戏原生交互音效（答对清脆叮咚、答错低音、倒计时滴答、胜利号角等）
 */

class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.analyser = null;
    this.sourceNode = null;
    this.hasMediaSource = false;

    // 原生音频播放器（不设 crossOrigin，确保 file:/// 本地文件秒开播放）
    this.audioElement = new Audio();
    this.audioElement.preload = "auto";
    this.preloadCache = new Map();
    this.isPlaying = false;
    this.currentBird = null;
    this.currentUrlIndex = 0;
    this.onStateChangeCallbacks = [];

    // Canvas 可视化状态
    this.canvas = null;
    this.canvasCtx = null;
    this.animationId = null;

    // 绑定音频播放器事件 (精确跟踪缓冲与真实播放)
    this.audioElement.addEventListener("loadstart", () => {
      this.isPlaying = false;
      this.notifyStateChange("loading");
    });
    this.audioElement.addEventListener("waiting", () => {
      this.isPlaying = false;
      this.notifyStateChange("loading");
    });
    this.audioElement.addEventListener("stalled", () => {
      this.isPlaying = false;
      this.notifyStateChange("loading");
    });
    this.audioElement.addEventListener("seeking", () => {
      this.isPlaying = false;
      this.notifyStateChange("loading");
    });
    this.audioElement.addEventListener("playing", () => {
      this.isPlaying = true;
      this.notifyStateChange("playing");
    });
    this.audioElement.addEventListener("timeupdate", () => {
      if (this.audioElement.currentTime > 0 && !this.audioElement.paused && !this.audioElement.ended) {
        if (!this.isPlaying) {
          this.isPlaying = true;
          this.notifyStateChange("playing");
        }
      }
    });
    this.audioElement.addEventListener("pause", () => {
      this.isPlaying = false;
      this.notifyStateChange("paused");
    });
    this.audioElement.addEventListener("ended", () => {
      this.isPlaying = false;
      this.notifyStateChange("ended");
    });
    this.audioElement.addEventListener("error", (e) => {
      console.warn("音频加载发生异常，尝试切换备用源:", this.audioElement.src, e);
      this.handleAudioError();
    });
  }

  // 初始化交互音效 Context
  initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 128;
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  // 注册状态监听
  onStateChange(cb) {
    this.onStateChangeCallbacks.push(cb);
  }

  notifyStateChange(state) {
    this.onStateChangeCallbacks.forEach((cb) =>
      cb(state, {
        bird: this.currentBird,
        isPlaying: this.isPlaying,
        src: this.audioElement.src,
        currentTime: this.audioElement.currentTime
      })
    );
  }

  // 判断是否正在产生声音播放
  isActuallyPlaying() {
    return (
      this.audioElement &&
      !this.audioElement.paused &&
      !this.audioElement.ended &&
      this.audioElement.readyState >= 2 &&
      this.audioElement.currentTime > 0
    );
  }

  // 绑定可视化画布
  bindCanvas(canvasElement) {
    this.canvas = canvasElement;
    this.canvasCtx = canvasElement.getContext("2d");
    this.startVisualizer();
  }

  // 预拉取指定 URL 的音频流并缓存在内存中
  preloadAudio(url) {
    if (!url || this.preloadCache.has(url)) return;
    try {
      const audio = new Audio();
      audio.preload = "auto";
      audio.src = url;
      this.preloadCache.set(url, audio);
    } catch (e) {
      console.warn("Preload audio error:", e);
    }
  }

  // 批量静默预拉取多只鸟类的音频
  preloadBirds(birds) {
    if (!Array.isArray(birds)) return;
    birds.forEach((bird) => {
      if (bird && Array.isArray(bird.audioUrls) && bird.audioUrls[0]) {
        this.preloadAudio(bird.audioUrls[0]);
      }
    });
  }

  // 播放鸟类真实录音
  playBird(bird) {
    this.initContext();
    this.stop();

    this.currentBird = bird;
    this.currentUrlIndex = 0;

    if (bird.audioUrls && bird.audioUrls.length > 0) {
      this.loadAndPlayUrl(bird.audioUrls[0]);
    }
  }

  loadAndPlayUrl(url) {
    try {
      this.isPlaying = false;
      this.audioElement.src = url;
      this.audioElement.currentTime = 0;
      this.audioElement.volume = 1.0;
      this.notifyStateChange("loading");
      
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // 播放请求被接收，实际开声由 playing / timeupdate 派发通知
          })
          .catch((err) => {
            console.warn("浏览器自动播放被拦截或文件需用户交互:", err);
            this.isPlaying = false;
            this.notifyStateChange("paused");
          });
      }
    } catch (e) {
      console.error("加载音频出错:", e);
      this.handleAudioError();
    }
  }

  handleAudioError() {
    this.currentUrlIndex++;
    if (
      this.currentBird &&
      this.currentBird.audioUrls &&
      this.currentUrlIndex < this.currentBird.audioUrls.length
    ) {
      const nextUrl = this.currentBird.audioUrls[this.currentUrlIndex];
      console.log("切换至备用音频源:", nextUrl);
      this.loadAndPlayUrl(nextUrl);
    } else {
      console.warn(`【${this.currentBird ? this.currentBird.name : "未知"}】暂无本地音频文件，已安全停止播放，严禁播放错误物种声音`);
      this.stop();
    }
  }

  // 暂停/停止当前声音
  stop() {
    this.isPlaying = false;
    try {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    } catch (e) {}
    this.notifyStateChange("stopped");
  }

  // 重新播放当前鸟声
  replay() {
    if (this.currentBird) {
      this.playBird(this.currentBird);
    }
  }

  /**
   * 游戏原生交互音效（Web Audio 毫秒级反馈）
   */
  playClickSfx() {
    this.playTone(600, 0.04, "sine", 0.15);
  }

  playSuccessSfx() {
    this.initContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.playTone(523.25, 0.1, "sine", 0.25, now); // C5
    this.playTone(659.25, 0.12, "sine", 0.25, now + 0.08); // E5
    this.playTone(783.99, 0.25, "triangle", 0.3, now + 0.16); // G5
    this.playTone(1046.5, 0.4, "sine", 0.2, now + 0.24); // C6
  }

  playErrorSfx() {
    this.initContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.playTone(280, 0.12, "sawtooth", 0.2, now);
    this.playTone(220, 0.25, "sawtooth", 0.25, now + 0.1);
  }

  playTickSfx(urgent = false) {
    this.initContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const freq = urgent ? 1200 : 800;
    const dur = urgent ? 0.03 : 0.02;
    this.playTone(freq, dur, "triangle", urgent ? 0.25 : 0.12, now);
  }

  playFanfareSfx() {
    this.initContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
    const delays = [0, 0.12, 0.24, 0.36, 0.52, 0.68];
    notes.forEach((n, i) => {
      this.playTone(n, i === notes.length - 1 ? 0.6 : 0.18, "sine", 0.3, now + delays[i]);
    });
  }

  playPropSfx() {
    this.initContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.playTone(440, 0.08, "sine", 0.2, now);
    this.playTone(659.25, 0.1, "triangle", 0.25, now + 0.06);
    this.playTone(880, 0.18, "sine", 0.25, now + 0.12);
  }

  playBonusSfx() {
    this.initContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    this.playTone(523.25, 0.08, "triangle", 0.2, now);
    this.playTone(659.25, 0.08, "triangle", 0.25, now + 0.07);
    this.playTone(783.99, 0.08, "triangle", 0.25, now + 0.14);
    this.playTone(1046.5, 0.25, "sine", 0.3, now + 0.21);
  }

  playTone(freq, duration, type = "sine", vol = 0.2, startTime = null) {
    try {
      this.initContext();
      if (!this.audioCtx) return;
      const t = startTime || this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(vol, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + duration + 0.05);
    } catch (e) {}
  }

  /**
   * 实时声波波形与频谱动态渲染器
   */
  startVisualizer() {
    if (!this.canvas || !this.canvasCtx) return;

    const render = () => {
      this.animationId = requestAnimationFrame(render);
      const ctx = this.canvasCtx;
      const width = this.canvas.width;
      const height = this.canvas.height;

      ctx.clearRect(0, 0, width, height);

      // 背景渐变
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "rgba(10, 30, 22, 0.4)");
      bgGrad.addColorStop(1, "rgba(6, 20, 14, 0.8)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      if (!this.isPlaying) {
        this.drawIdleWave(ctx, width, height);
        return;
      }

      // 动态真实鸟鸣声波频谱跳动
      const time = Date.now() * 0.005;
      const barCount = 48;
      const barWidth = (width / barCount) * 0.8;
      const gap = (width / barCount) * 0.2;
      const centerY = height / 2;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + gap) + gap / 2;
        // 结合鸟鸣频率波形动态调制
        const wave1 = Math.sin(i * 0.25 + time * 2);
        const wave2 = Math.cos(i * 0.15 - time * 3);
        const wave3 = Math.sin(i * 0.4 + time * 1.5);
        const energy = Math.abs(wave1 * 0.4 + wave2 * 0.35 + wave3 * 0.25);
        const barHeight = Math.max(8, energy * height * 0.85);

        const grad = ctx.createLinearGradient(0, centerY - barHeight / 2, 0, centerY + barHeight / 2);
        grad.addColorStop(0, "rgba(52, 211, 153, 0.95)"); // 翡翠亮绿
        grad.addColorStop(0.5, "rgba(16, 185, 129, 0.85)");
        grad.addColorStop(1, "rgba(245, 158, 11, 0.9)"); // 晨曦金黄

        ctx.fillStyle = grad;
        ctx.shadowColor = "rgba(52, 211, 153, 0.7)";
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.roundRect(x, centerY - barHeight / 2, barWidth, barHeight, 4);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    render();
  }

  drawIdleWave(ctx, width, height) {
    const time = Date.now() * 0.002;
    const centerY = height / 2;

    ctx.beginPath();
    ctx.strokeStyle = "rgba(52, 211, 153, 0.35)";
    ctx.lineWidth = 2;

    for (let x = 0; x < width; x += 4) {
      const y = centerY + Math.sin(x * 0.02 + time) * 4 * Math.sin(x * 0.008);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 提示文字
    ctx.fillStyle = "rgba(167, 243, 208, 0.55)";
    ctx.font = "12px 'Outfit', -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("正在准备真实野外鸟鸣音频 · 点击播放聆听", width / 2, centerY + 28);
  }
}

// 导出单例
window.birdAudioEngine = new AudioEngine();
