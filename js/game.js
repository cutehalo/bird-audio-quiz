/**
 * 听音识鸟 - 游戏核心逻辑控制器 (GameController)
 * 支持：全量鸟类 / 林鸟专场 / 水鸟专场 题库筛选
 * 支持：经典 10 题模式 / 3 次容错无尽生存模式 / 宝可梦大师模式 (图鉴羁绊收集)
 * 支持：三大强力道具 (排除二错 / 延时60秒 / 双倍得分 各 3 个)
 * 支持：连续答对连胜倍率奖励 (3连胜 2倍 / 10连胜 4倍)
 * 支持：5 秒极速抢答奖励 (+5 分)
 * 支持：宝可梦体力系统 (每日5点，每3小时恢复1点)、指数熟练度星级收集与同科羁绊系统
 */

class BirdQuizGame {
  constructor() {
    this.totalQuestions = 10;
    this.defaultTimeLimit = 20; // 默认每题 20 秒
    this.timeLimit = 20;
    this.pointsPerQuestion = 10;

    // 模式与题库配置
    this.selectedPool = "all"; // 'all' | 'forest' | 'water'
    this.gameMode = "classic"; // 'classic' | 'endless' | 'pokemon'
    this.maxLives = 3;
    this.lives = 3;
    this.streak = 0;
    this.maxStreak = 0;

    // 道具系统 (经典/无尽每局各 3 个；宝可梦模式使用当前积分兑换，初始20分每次翻倍)
    this.props = {
      remove: 3,
      time: 3,
      double: 3
    };
    this.pokemonPropCosts = {
      remove: 20,
      time: 20,
      double: 20
    };
    this.usedRemoveThisRound = false;
    this.usedTimeThisRound = false;
    this.usedDoubleThisRound = false;

    this.currentRound = 0;
    this.score = 0;
    this.questions = [];
    this.history = []; // 答题记录

    this.timer = null;
    this.timeLeft = 20;
    this.timerInterval = null;
    this.questionStartTime = 0;
    this.isAnswered = false;

    // 模式、难度与题库区域配置状态
    this.selectedPool = "all"; // 'all' | 'forest' | 'water'
    this.selectedDifficulty = "hard"; // 'easy' | 'normal' | 'hard'
    this.selectedRegion = "all"; // 'all' | 'north' | 'northeast' | 'east' | 'central' | 'south' | 'southwest' | 'northwest'
    this.selectedProvince = "all"; // 'all' | '北京' | '广东' | '四川' ...
    this.gameMode = "classic"; // 'classic' | 'endless' | 'pokemon'

    // 百鸟图鉴分页与筛选状态
    this.dexCategory = "all";
    this.dexKeyword = "";
    this.dexPage = 1;
    this.dexPageSize = 40;

    // 宝可梦图鉴与羁绊殿堂状态
    this.pokemonStarFilter = "all";
    this.pokemonKeyword = "";
    this.pokemonPage = 1;
    this.pokemonPageSize = 36;
    this.pokemonActiveTab = "dex"; // 'dex' | 'bonds'

    // 倒计时与音频播放状态 (严格检测音频真实播放状态，未播放或缓冲时不走秒)
    this.isTimerStarted = false;
    this.isTimerPaused = false;
    this.audioFallbackTimer = null;

    // DOM 元素引用缓存
    this.dom = {
      headerHomeBtn: document.getElementById("header-home-btn"),

      startScreen: document.getElementById("start-screen"),
      quizScreen: document.getElementById("quiz-screen"),
      summaryScreen: document.getElementById("summary-screen"),
      birdDexModal: document.getElementById("bird-dex-modal"),
      pokemonDexModal: document.getElementById("pokemon-dex-modal"),

      // 训练家状态条
      trainerLevel: document.getElementById("trainer-level"),
      trainerExp: document.getElementById("trainer-exp"),
      staminaVal: document.getElementById("stamina-val"),
      staminaCountdown: document.getElementById("stamina-countdown"),
      totalCollectedVal: document.getElementById("total-collected-val"),
      totalBondsVal: document.getElementById("total-bonds-val"),
      bondsCountTab: document.getElementById("bonds-count-tab"),

      // 模式、难度与区域分类选择器
      poolSelector: document.getElementById("pool-selector"),
      difficultySelector: document.getElementById("difficulty-selector"),
      regionSelector: document.getElementById("region-selector"),
      provinceSelect: document.getElementById("province-select"),
      poolCountBadge: document.getElementById("pool-count-badge"),
      modeSelector: document.getElementById("mode-selector"),

      // 顶部指标
      roundIndicator: document.getElementById("round-indicator"),
      scoreIndicator: document.getElementById("score-indicator"),
      livesIndicator: document.getElementById("lives-indicator"),
      livesHearts: document.getElementById("lives-hearts"),
      timerText: document.getElementById("timer-text"),
      timerBar: document.getElementById("timer-bar"),

      // 连胜与宝可梦遭遇提示条
      bonusStatusBanner: document.getElementById("bonus-status-banner"),
      bonusIcon: document.getElementById("bonus-icon"),
      bonusText: document.getElementById("bonus-text"),
      pokemonEncounterBanner: document.getElementById("pokemon-encounter-banner"),
      encounterText: document.getElementById("encounter-text"),
      encounterBondTag: document.getElementById("encounter-bond-tag"),

      // 道具栏
      propRemoveBtn: document.getElementById("prop-remove-btn"),
      propRemoveCount: document.getElementById("prop-remove-count"),
      propTimeBtn: document.getElementById("prop-time-btn"),
      propTimeCount: document.getElementById("prop-time-count"),
      propDoubleBtn: document.getElementById("prop-double-btn"),
      propDoubleCount: document.getElementById("prop-double-count"),

      // 声音控制器与可视化
      playAudioBtn: document.getElementById("play-audio-btn"),
      audioStatusText: document.getElementById("audio-status-text"),
      visualizerCanvas: document.getElementById("visualizer-canvas"),

      // 选项与反馈
      optionsGrid: document.getElementById("options-grid"),
      feedbackCard: document.getElementById("feedback-card"),
      feedbackTitle: document.getElementById("feedback-title"),
      feedbackBirdName: document.getElementById("feedback-bird-name"),
      feedbackBirdLatin: document.getElementById("feedback-bird-latin"),
      feedbackVoice: document.getElementById("feedback-voice"),
      feedbackFact: document.getElementById("feedback-fact"),
      pokemonFeedbackContainer: document.getElementById("pokemon-feedback-container"),
      nextBtn: document.getElementById("next-btn"),

      // 结算页面
      summaryModeBadge: document.getElementById("summary-mode-badge"),
      finalScore: document.getElementById("final-score"),
      finalScoreUnit: document.getElementById("final-score-unit"),
      scoreBadge: document.getElementById("score-badge"),
      scoreSummaryText: document.getElementById("score-summary-text"),
      statCorrect: document.getElementById("stat-correct"),
      statCorrectLabel: document.getElementById("stat-correct-label"),
      statAccuracy: document.getElementById("stat-accuracy"),
      statAvgTime: document.getElementById("stat-avg-time"),
      statExtraLabel: document.getElementById("stat-extra-label"),
      reviewList: document.getElementById("review-list"),

      // 500 鸟类大百科图鉴
      dexFilters: document.getElementById("dex-filters"),
      dexSearchInput: document.getElementById("dex-search"),
      dexGrid: document.getElementById("dex-grid"),
      prevPageBtn: document.getElementById("prev-page-btn"),
      nextPageBtn: document.getElementById("next-page-btn"),
      pageInfo: document.getElementById("page-info"),

      // 宝可梦大师图鉴 & 羁绊殿堂
      tabBtnDex: document.getElementById("tab-btn-dex"),
      tabBtnBonds: document.getElementById("tab-btn-bonds"),
      tabPokemonDex: document.getElementById("tab-pokemon-dex"),
      tabPokemonBonds: document.getElementById("tab-pokemon-bonds"),
      pokemonDexFilters: document.getElementById("pokemon-dex-filters"),
      pokemonSearch: document.getElementById("pokemon-search"),
      pokemonGrid: document.getElementById("pokemon-grid"),
      bondsGrid: document.getElementById("bonds-grid"),
      pokemonPrevPage: document.getElementById("pokemon-prev-page"),
      pokemonNextPage: document.getElementById("pokemon-next-page"),
      pokemonPageInfo: document.getElementById("pokemon-page-info")
    };

    this.init();
  }

  init() {
    // 绑定音频引擎状态
    if (window.birdAudioEngine) {
      window.birdAudioEngine.bindCanvas(this.dom.visualizerCanvas);
      window.birdAudioEngine.onStateChange((state, payload) => {
        this.updateAudioButtonUI(state, payload);
      });
    }

    // 绑定事件监听器
    this.bindEvents();
    this.renderBirdDex();
    this.updateTrainerStatusUI();
    this.updatePoolCountBadge();

    // 启动训练家体力实时恢复计时器
    setInterval(() => {
      this.updateTrainerStatusUI();
    }, 1000);
  }

  bindEvents() {
    // 顶部返回菜单主页按钮
    if (this.dom.headerHomeBtn) {
      this.dom.headerHomeBtn.addEventListener("click", () => {
        if (window.birdAudioEngine) window.birdAudioEngine.playClickSfx();
        this.returnToHome();
      });
    }

    // 1. 题库生境分类切换
    if (this.dom.poolSelector) {
      this.dom.poolSelector.addEventListener("click", (e) => {
        const chip = e.target.closest(".config-chip");
        if (chip) {
          this.dom.poolSelector
            .querySelectorAll(".config-chip")
            .forEach((c) => c.classList.remove("active"));
          chip.classList.add("active");
          this.selectedPool = chip.dataset.pool || "all";
          if (window.birdAudioEngine) window.birdAudioEngine.playClickSfx();
          this.updatePoolCountBadge();
        }
      });
    }

    // 2. 识别难度分级切换 (简单前20% / 普通前50% / 困难全量)
    if (this.dom.difficultySelector) {
      this.dom.difficultySelector.addEventListener("click", (e) => {
        const chip = e.target.closest(".config-chip");
        if (chip) {
          this.dom.difficultySelector
            .querySelectorAll(".config-chip")
            .forEach((c) => c.classList.remove("active"));
          chip.classList.add("active");
          this.selectedDifficulty = chip.dataset.difficulty || "hard";
          if (window.birdAudioEngine) window.birdAudioEngine.playClickSfx();
          this.updatePoolCountBadge();
        }
      });
    }

    // 3. 地理区域快捷切换 (8 大地理大区)
    if (this.dom.regionSelector) {
      this.dom.regionSelector.addEventListener("click", (e) => {
        const chip = e.target.closest(".config-chip");
        if (chip) {
          this.dom.regionSelector
            .querySelectorAll(".config-chip")
            .forEach((c) => c.classList.remove("active"));
          chip.classList.add("active");
          this.selectedRegion = chip.dataset.region || "all";

          // 若切换大区且之前选了某省份，检查省份是否仍属于该大区，不属于则重置为全部
          if (this.dom.provinceSelect) {
            if (this.selectedRegion === "all") {
              this.dom.provinceSelect.value = "all";
              this.selectedProvince = "all";
            } else {
              const curProv = this.dom.provinceSelect.value;
              const expectedReg = window.PROVINCE_TO_REGION ? window.PROVINCE_TO_REGION[curProv] : null;
              if (expectedReg !== this.selectedRegion) {
                this.dom.provinceSelect.value = "all";
                this.selectedProvince = "all";
              }
            }
          }

          if (window.birdAudioEngine) window.birdAudioEngine.playClickSfx();
          this.updatePoolCountBadge();
        }
      });
    }

    // 4. 省级行政区细化下拉选单
    if (this.dom.provinceSelect) {
      this.dom.provinceSelect.addEventListener("change", (e) => {
        this.selectedProvince = e.target.value;
        if (this.selectedProvince !== "all" && window.PROVINCE_TO_REGION) {
          const mappedRegion = window.PROVINCE_TO_REGION[this.selectedProvince];
          if (mappedRegion && this.dom.regionSelector) {
            this.selectedRegion = mappedRegion;
            this.dom.regionSelector
              .querySelectorAll(".config-chip")
              .forEach((c) => {
                if (c.dataset.region === mappedRegion) {
                  c.classList.add("active");
                } else {
                  c.classList.remove("active");
                }
              });
          }
        }
        if (window.birdAudioEngine) window.birdAudioEngine.playClickSfx();
        this.updatePoolCountBadge();
      });
    }

    // 5. 挑战模式切换
    if (this.dom.modeSelector) {
      this.dom.modeSelector.addEventListener("click", (e) => {
        const chip = e.target.closest(".config-chip");
        if (chip) {
          this.dom.modeSelector
            .querySelectorAll(".config-chip")
            .forEach((c) => c.classList.remove("active"));
          chip.classList.add("active");
          this.gameMode = chip.dataset.mode || "classic";
          if (window.birdAudioEngine) window.birdAudioEngine.playClickSfx();
        }
      });
    }

    // 开始游戏
    document.getElementById("start-game-btn").addEventListener("click", () => {
      if (window.birdAudioEngine) window.birdAudioEngine.playClickSfx();
      this.startNewGame();
    });

    // 重新开始
    document.getElementById("restart-btn").addEventListener("click", () => {
      if (window.birdAudioEngine) window.birdAudioEngine.playClickSfx();
      this.startNewGame();
    });

    // 道具 1：排除二错
    if (this.dom.propRemoveBtn) {
      this.dom.propRemoveBtn.addEventListener("click", () => {
        this.useRemoveProp();
      });
    }

    // 道具 2：延至 60 秒
    if (this.dom.propTimeBtn) {
      this.dom.propTimeBtn.addEventListener("click", () => {
        this.useTimeProp();
      });
    }

    // 道具 3：双倍计分
    if (this.dom.propDoubleBtn) {
      this.dom.propDoubleBtn.addEventListener("click", () => {
        this.useDoubleProp();
      });
    }

    // 播放/重播当前鸟声
    this.dom.playAudioBtn.addEventListener("click", () => {
      if (window.birdAudioEngine) window.birdAudioEngine.playClickSfx();
      const currentQ = this.questions[this.currentRound];
      if (currentQ) {
        if (window.birdAudioEngine.isPlaying) {
          window.birdAudioEngine.stop();
        } else {
          window.birdAudioEngine.playBird(currentQ.bird);
        }
      }
    });

    // 下一题
    this.dom.nextBtn.addEventListener("click", () => {
      if (window.birdAudioEngine) window.birdAudioEngine.playClickSfx();
      this.goToNextQuestion();
    });

    // 百鸟图鉴开关
    document.querySelectorAll(".open-dex-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (window.birdAudioEngine) window.birdAudioEngine.playClickSfx();
        this.dom.birdDexModal.classList.add("active");
        this.renderBirdDex();
      });
    });

    document.getElementById("close-dex-btn").addEventListener("click", () => {
      if (window.birdAudioEngine) window.birdAudioEngine.playClickSfx();
      this.dom.birdDexModal.classList.remove("active");
    });

    // 宝可梦大师图鉴 & 羁绊殿堂开关
    document.querySelectorAll(".open-pokemon-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (window.birdAudioEngine) window.birdAudioEngine.playClickSfx();
        this.dom.pokemonDexModal.classList.add("active");
        this.renderPokemonDex();
        this.renderBondsHall();
      });
    });

    if (document.getElementById("close-pokemon-dex-btn")) {
      document.getElementById("close-pokemon-dex-btn").addEventListener("click", () => {
        if (window.birdAudioEngine) window.birdAudioEngine.playClickSfx();
        this.dom.pokemonDexModal.classList.remove("active");
      });
    }

    // 宝可梦模态窗 Tab 切换
    if (this.dom.tabBtnDex && this.dom.tabBtnBonds) {
      this.dom.tabBtnDex.addEventListener("click", () => {
        this.pokemonActiveTab = "dex";
        this.dom.tabBtnDex.classList.add("active");
        this.dom.tabBtnBonds.classList.remove("active");
        this.dom.tabPokemonDex.style.display = "block";
        this.dom.tabPokemonBonds.style.display = "none";
        this.renderPokemonDex();
      });

      this.dom.tabBtnBonds.addEventListener("click", () => {
        this.pokemonActiveTab = "bonds";
        this.dom.tabBtnBonds.classList.add("active");
        this.dom.tabBtnDex.classList.remove("active");
        this.dom.tabPokemonBonds.style.display = "block";
        this.dom.tabPokemonDex.style.display = "none";
        this.renderBondsHall();
      });
    }

    // 宝可梦图鉴星级筛选
    if (this.dom.pokemonDexFilters) {
      this.dom.pokemonDexFilters.addEventListener("click", (e) => {
        const chip = e.target.closest(".filter-chip");
        if (chip) {
          this.dom.pokemonDexFilters
            .querySelectorAll(".filter-chip")
            .forEach((c) => c.classList.remove("active"));
          chip.classList.add("active");
          this.pokemonStarFilter = chip.dataset.star || "all";
          this.pokemonPage = 1;
          this.renderPokemonDex();
        }
      });
    }

    // 宝可梦图鉴搜索
    if (this.dom.pokemonSearch) {
      this.dom.pokemonSearch.addEventListener("input", (e) => {
        this.pokemonKeyword = e.target.value.trim();
        this.pokemonPage = 1;
        this.renderPokemonDex();
      });
    }

    // 宝可梦图鉴分页
    if (this.dom.pokemonPrevPage) {
      this.dom.pokemonPrevPage.addEventListener("click", () => {
        if (this.pokemonPage > 1) {
          this.pokemonPage--;
          this.renderPokemonDex();
        }
      });
    }

    if (this.dom.pokemonNextPage) {
      this.dom.pokemonNextPage.addEventListener("click", () => {
        this.pokemonPage++;
        this.renderPokemonDex();
      });
    }

    // 500 百鸟图鉴分类 Filter 点击
    if (this.dom.dexFilters) {
      this.dom.dexFilters.addEventListener("click", (e) => {
        const chip = e.target.closest(".filter-chip");
        if (chip) {
          this.dom.dexFilters
            .querySelectorAll(".filter-chip")
            .forEach((c) => c.classList.remove("active"));
          chip.classList.add("active");
          this.dexCategory = chip.dataset.category || "all";
          this.dexPage = 1;
          this.renderBirdDex();
        }
      });
    }

    // 百鸟图鉴搜索
    if (this.dom.dexSearchInput) {
      this.dom.dexSearchInput.addEventListener("input", (e) => {
        this.dexKeyword = e.target.value.trim();
        this.dexPage = 1;
        this.renderBirdDex();
      });
    }

    // 百鸟图鉴分页
    if (this.dom.prevPageBtn) {
      this.dom.prevPageBtn.addEventListener("click", () => {
        if (this.dexPage > 1) {
          this.dexPage--;
          this.renderBirdDex();
        }
      });
    }

    if (this.dom.nextPageBtn) {
      this.dom.nextPageBtn.addEventListener("click", () => {
        this.dexPage++;
        this.renderBirdDex();
      });
    }

    // 键盘快捷键 1, 2, 3, 4
    window.addEventListener("keydown", (e) => {
      if (this.dom.quizScreen.classList.contains("active") && !this.isAnswered) {
        const key = e.key;
        if (["1", "2", "3", "4"].includes(key)) {
          const idx = parseInt(key, 10) - 1;
          const allButtons = this.dom.optionsGrid.querySelectorAll(".option-btn");
          if (allButtons[idx] && !allButtons[idx].classList.contains("eliminated")) {
            allButtons[idx].click();
          }
        } else if (e.code === "Space") {
          e.preventDefault();
          this.dom.playAudioBtn.click();
        }
      } else if (this.isAnswered && (e.key === "Enter" || e.code === "Space")) {
        if (this.dom.nextBtn && !this.dom.nextBtn.disabled && this.dom.nextBtn.style.display !== "none") {
          this.dom.nextBtn.click();
        }
      }
    });
  }

  // 返回菜单主页
  returnToHome() {
    this.clearTimer();
    if (window.birdAudioEngine) {
      window.birdAudioEngine.stop();
    }
    this.dom.birdDexModal.classList.remove("active");
    if (this.dom.pokemonDexModal) {
      this.dom.pokemonDexModal.classList.remove("active");
    }
    this.showScreen("startScreen");
    this.updateTrainerStatusUI();
  }

  // 更新主界面的训练师状态
  updateTrainerStatusUI() {
    if (!window.birdPokemonSystem) return;
    const stats = window.birdPokemonSystem.getStatsSummary();
    const timeInfo = window.birdPokemonSystem.getTimeToNextStamina();

    if (this.dom.trainerLevel) this.dom.trainerLevel.textContent = stats.trainerLevel;
    if (this.dom.trainerExp) this.dom.trainerExp.textContent = stats.trainerExp;
    if (this.dom.staminaVal) this.dom.staminaVal.textContent = `${stats.stamina} / 5`;
    if (this.dom.staminaCountdown) this.dom.staminaCountdown.textContent = timeInfo.text;
    if (this.dom.totalCollectedVal) this.dom.totalCollectedVal.textContent = `${stats.totalCollected} / 500`;
    if (this.dom.totalBondsVal) this.dom.totalBondsVal.textContent = `${stats.totalBonds} 科`;
    if (this.dom.bondsCountTab) this.dom.bondsCountTab.textContent = stats.totalBonds;
  }

  // 实时更新题库匹配鸟类数量徽章
  updatePoolCountBadge() {
    if (!this.dom.poolCountBadge) return;
    const birds = this.getPoolBirds();
    this.dom.poolCountBadge.textContent = `🎯 当前匹配: ${birds.length} 种`;
  }

  /**
   * 根据用户选择的 生境、难度 (简单前20%/普通前50%/困难全部) 与 地理区域/省级行政区 获取题库鸟类
   */
  getPoolBirds() {
    const allBirds = Array.isArray(BIRDS_500_DATA) ? BIRDS_500_DATA : [];
    const total = allBirds.length;
    const easyLimit = Math.ceil(total * 0.20);
    const normalLimit = Math.ceil(total * 0.50);

    const filtered = allBirds.filter((b) => {
      // 1. 生境分类过滤
      if (this.selectedPool === "forest") {
        const isForest =
          b.category === "鸣禽" ||
          b.category === "攀禽" ||
          b.category === "陆禽" ||
          (b.category === "猛禽" &&
            (!b.habitat ||
              (!b.habitat.includes("湿地") &&
                !b.habitat.includes("水") &&
                !b.habitat.includes("湖") &&
                !b.habitat.includes("滩"))));
        if (!isForest) return false;
      } else if (this.selectedPool === "water") {
        const isWater =
          b.category === "游禽" ||
          b.category === "涉禽" ||
          (b.habitat &&
            (b.habitat.includes("水") ||
              b.habitat.includes("湖") ||
              b.habitat.includes("河") ||
              b.habitat.includes("湿地") ||
              b.habitat.includes("海") ||
              b.habitat.includes("滩") ||
              b.habitat.includes("库")));
        if (!isWater) return false;
      }

      // 2. 识别难度分级过滤 (简单: 前20%, 普通: 前50%, 困难: 全部100%)
      if (this.selectedDifficulty === "easy") {
        const isEasy = (b.commonRank && b.commonRank <= easyLimit) || b.commonTier === "easy";
        if (!isEasy) return false;
      } else if (this.selectedDifficulty === "normal") {
        const isNormal = (b.commonRank && b.commonRank <= normalLimit) || b.commonTier !== "hard";
        if (!isNormal) return false;
      }

      // 3. 区域与省级行政区过滤
      if (this.selectedProvince && this.selectedProvince !== "all") {
        const provMatch =
          Array.isArray(b.provinces) &&
          (b.provinces.includes("全国") || b.provinces.includes(this.selectedProvince));
        if (!provMatch) return false;
      } else if (this.selectedRegion && this.selectedRegion !== "all") {
        const regMatch =
          Array.isArray(b.regions) &&
          (b.regions.includes("all") || b.regions.includes(this.selectedRegion));
        if (!regMatch) return false;
      }

      return true;
    });

    // 兜底保障：若筛选后鸟类 >= 4 种则直接返回
    if (filtered.length >= 4) {
      return filtered;
    }

    // 若筛选条件过于苛刻导致可用物种 < 4 种，按省份适当放宽保障出题
    const relaxed = allBirds.filter((b) => {
      if (this.selectedProvince && this.selectedProvince !== "all") {
        return (
          Array.isArray(b.provinces) &&
          (b.provinces.includes("全国") || b.provinces.includes(this.selectedProvince))
        );
      }
      if (this.selectedRegion && this.selectedRegion !== "all") {
        return (
          Array.isArray(b.regions) &&
          (b.regions.includes("all") || b.regions.includes(this.selectedRegion))
        );
      }
      return true;
    });

    return relaxed.length >= 4 ? relaxed : allBirds;
  }

  /**
   * 构造一道单题，包含目标鸟类与 3 个智能干扰项
   */
  createSingleQuestion(targetBird, poolBirds) {
    const all500 = Array.isArray(BIRDS_500_DATA) ? BIRDS_500_DATA : poolBirds;
    const poolDistractors = poolBirds.filter((b) => b.name !== targetBird.name);
    const globalDistractors = all500.filter((b) => b.name !== targetBird.name);

    const chosen = [];
    const sameCat = poolDistractors.filter((b) => b.category === targetBird.category);
    sameCat.sort(() => Math.random() - 0.5);

    if (sameCat.length > 0) chosen.push(sameCat[0].name);
    if (sameCat.length > 1) chosen.push(sameCat[1].name);

    const candidateDistractors = (
      poolDistractors.length >= 3 ? poolDistractors : globalDistractors
    ).sort(() => Math.random() - 0.5);

    for (const b of candidateDistractors) {
      if (chosen.length >= 3) break;
      if (!chosen.includes(b.name)) chosen.push(b.name);
    }

    while (chosen.length < 3) {
      const rand = globalDistractors[Math.floor(Math.random() * globalDistractors.length)];
      if (!chosen.includes(rand.name)) chosen.push(rand.name);
    }

    const options = [targetBird.name, ...chosen].sort(() => Math.random() - 0.5);

    return {
      bird: targetBird,
      options: options,
      correctAnswer: targetBird.name
    };
  }

  // 计算当前题目的连胜倍率
  getStreakMultiplier() {
    if (this.gameMode === "pokemon") {
      // 宝可梦模式：每连续答对 5 题，积分多翻一倍 (例如 5 连胜 2 倍，10 连胜 3 倍，15 连胜 4 倍，20 连胜 5 倍...)
      const bonusFolds = Math.floor(this.streak / 5);
      return 1 + bonusFolds;
    }

    // 经典模式与无尽生存模式：3 连胜 2 倍，10 连胜 4 倍
    if (this.streak >= 10) return 4;
    if (this.streak >= 3) return 2;
    return 1;
  }

  // 启动新游戏
  startNewGame() {
    // 若选择宝可梦模式，先检查并扣除体力
    if (this.gameMode === "pokemon") {
      if (!window.birdPokemonSystem || !window.birdPokemonSystem.consumeStamina()) {
        const timeInfo = window.birdPokemonSystem
          ? window.birdPokemonSystem.getTimeToNextStamina().text
          : "3小时";
        alert(`⚡ 体力不足！当前体力为 0 点。\n\n系统每 3 小时自动恢复 1 点体力（距离下次恢复还有 ${timeInfo}）。\n您可先体验【经典模式】或【无尽模式】！`);
        if (window.birdAudioEngine) window.birdAudioEngine.playErrorSfx();
        return;
      }
      this.updateTrainerStatusUI();
    }

    this.score = 0;
    this.currentRound = 0;
    this.history = [];
    this.streak = 0;
    this.maxStreak = 0;
    this.lives = this.maxLives;

    // 重置道具库 (经典/无尽各 3 个；宝可梦模式初始每种 20 分，使用后翻倍)
    this.props = {
      remove: 3,
      time: 3,
      double: 3
    };
    this.pokemonPropCosts = {
      remove: 20,
      time: 20,
      double: 20
    };

    const poolBirds = this.getPoolBirds();
    this.shuffledPool = [...poolBirds].sort(() => Math.random() - 0.5);
    this.poolIndex = 0;

    if (this.gameMode === "classic") {
      this.totalQuestions = 10;
      const targets = this.shuffledPool.slice(0, Math.min(10, this.shuffledPool.length));
      this.questions = targets.map((t) => this.createSingleQuestion(t, poolBirds));
    } else {
      // 无尽生存模式与宝可梦大师模式
      this.questions = [];
      const firstTarget = this.shuffledPool[0];
      this.poolIndex = 1;
      this.questions.push(this.createSingleQuestion(firstTarget, poolBirds));
    }

    this.showScreen("quizScreen");
    this.updateLivesUI();
    this.loadQuestion(0);
  }

  // 更新生命值 UI
  updateLivesUI() {
    if (!this.dom.livesIndicator || !this.dom.livesHearts) return;
    if (this.gameMode === "endless" || this.gameMode === "pokemon") {
      this.dom.livesIndicator.style.display = "inline-flex";
      let hearts = "";
      for (let i = 0; i < this.maxLives; i++) {
        hearts += i < this.lives ? "❤️" : "🖤";
      }
      this.dom.livesHearts.textContent = hearts;
    } else {
      this.dom.livesIndicator.style.display = "none";
    }
  }

  // 更新道具操作栏状态
  updatePropsUI() {
    if (this.gameMode === "pokemon") {
      // 宝可梦模式：使用当前积分兑换道具 (初始 20 分，使用一次后翻倍)
      if (this.dom.propRemoveCount) {
        this.dom.propRemoveCount.className = "prop-badge cost-badge";
        this.dom.propRemoveCount.textContent = `🪙 ${this.pokemonPropCosts.remove}分`;
      }
      if (this.dom.propTimeCount) {
        this.dom.propTimeCount.className = "prop-badge cost-badge";
        this.dom.propTimeCount.textContent = `🪙 ${this.pokemonPropCosts.time}分`;
      }
      if (this.dom.propDoubleCount) {
        this.dom.propDoubleCount.className = "prop-badge cost-badge";
        this.dom.propDoubleCount.textContent = `🪙 ${this.pokemonPropCosts.double}分`;
      }

      if (this.dom.propRemoveBtn) {
        this.dom.propRemoveBtn.title = `消耗 ${this.pokemonPropCosts.remove} 积分排除 2 个错误干扰选项 (用后翻倍)`;
        this.dom.propRemoveBtn.disabled =
          this.score < this.pokemonPropCosts.remove || this.usedRemoveThisRound || this.isAnswered;
      }
      if (this.dom.propTimeBtn) {
        this.dom.propTimeBtn.title = `消耗 ${this.pokemonPropCosts.time} 积分将倒计时延至 60 秒 (用后翻倍)`;
        this.dom.propTimeBtn.disabled =
          this.score < this.pokemonPropCosts.time || this.usedTimeThisRound || this.isAnswered;
      }
      if (this.dom.propDoubleBtn) {
        this.dom.propDoubleBtn.title = `消耗 ${this.pokemonPropCosts.double} 积分使本题基础得分直接翻倍 (用后翻倍)`;
        this.dom.propDoubleBtn.disabled =
          this.score < this.pokemonPropCosts.double || this.usedDoubleThisRound || this.isAnswered;
        if (this.usedDoubleThisRound) {
          this.dom.propDoubleBtn.classList.add("activated");
        } else {
          this.dom.propDoubleBtn.classList.remove("activated");
        }
      }
    } else {
      // 经典模式与无尽模式：固定每局各 3 个
      if (this.dom.propRemoveCount) {
        this.dom.propRemoveCount.className = "prop-badge";
        this.dom.propRemoveCount.textContent = `x${this.props.remove}`;
      }
      if (this.dom.propTimeCount) {
        this.dom.propTimeCount.className = "prop-badge";
        this.dom.propTimeCount.textContent = `x${this.props.time}`;
      }
      if (this.dom.propDoubleCount) {
        this.dom.propDoubleCount.className = "prop-badge";
        this.dom.propDoubleCount.textContent = `x${this.props.double}`;
      }

      if (this.dom.propRemoveBtn) {
        this.dom.propRemoveBtn.title = "排除 2 个错误干扰选项 (每局 3 次)";
        this.dom.propRemoveBtn.disabled =
          this.props.remove <= 0 || this.usedRemoveThisRound || this.isAnswered;
      }
      if (this.dom.propTimeBtn) {
        this.dom.propTimeBtn.title = "将本题倒计时重置并延长至 60 秒 (每局 3 次)";
        this.dom.propTimeBtn.disabled =
          this.props.time <= 0 || this.usedTimeThisRound || this.isAnswered;
      }
      if (this.dom.propDoubleBtn) {
        this.dom.propDoubleBtn.title = "本题基础得分直接翻倍 (每局 3 次)";
        this.dom.propDoubleBtn.disabled =
          this.props.double <= 0 || this.usedDoubleThisRound || this.isAnswered;
        if (this.usedDoubleThisRound) {
          this.dom.propDoubleBtn.classList.add("activated");
        } else {
          this.dom.propDoubleBtn.classList.remove("activated");
        }
      }
    }
  }

  // 道具 1：排除 2 个错误答案
  useRemoveProp() {
    if (this.isAnswered || this.usedRemoveThisRound) return;

    if (this.gameMode === "pokemon") {
      const cost = this.pokemonPropCosts.remove;
      if (this.score < cost) return;
      this.score -= cost;
      this.pokemonPropCosts.remove *= 2; // 消耗翻倍
      const streakText = this.streak >= 2 ? ` 🔥${this.streak}` : "";
      this.dom.scoreIndicator.textContent = `得分: ${this.score}${streakText}`;
    } else {
      if (this.props.remove <= 0) return;
      this.props.remove--;
    }

    this.usedRemoveThisRound = true;

    const currentQ = this.questions[this.currentRound];
    const buttons = Array.from(this.dom.optionsGrid.querySelectorAll(".option-btn"));
    const wrongButtons = buttons.filter((btn) => {
      const text = btn.querySelector(".option-text").textContent;
      return text !== currentQ.correctAnswer && !btn.classList.contains("eliminated");
    });

    wrongButtons.sort(() => Math.random() - 0.5);
    const toEliminate = wrongButtons.slice(0, 2);
    toEliminate.forEach((btn) => {
      btn.classList.add("eliminated");
      btn.disabled = true;
    });

    if (window.birdAudioEngine) window.birdAudioEngine.playPropSfx();
    this.updatePropsUI();
  }

  // 道具 2：延长时间至 60 秒
  useTimeProp() {
    if (this.isAnswered || this.usedTimeThisRound) return;

    if (this.gameMode === "pokemon") {
      const cost = this.pokemonPropCosts.time;
      if (this.score < cost) return;
      this.score -= cost;
      this.pokemonPropCosts.time *= 2; // 消耗翻倍
      const streakText = this.streak >= 2 ? ` 🔥${this.streak}` : "";
      this.dom.scoreIndicator.textContent = `得分: ${this.score}${streakText}`;
    } else {
      if (this.props.time <= 0) return;
      this.props.time--;
    }

    this.usedTimeThisRound = true;

    this.timeLimit = 60;
    this.timeLeft = 60;
    this.questionStartTime = Date.now();
    this.updateTimerUI();

    if (window.birdAudioEngine) window.birdAudioEngine.playPropSfx();
    this.updatePropsUI();
  }

  // 道具 3：双倍计分
  useDoubleProp() {
    if (this.isAnswered || this.usedDoubleThisRound) return;

    if (this.gameMode === "pokemon") {
      const cost = this.pokemonPropCosts.double;
      if (this.score < cost) return;
      this.score -= cost;
      this.pokemonPropCosts.double *= 2; // 消耗翻倍
      const streakText = this.streak >= 2 ? ` 🔥${this.streak}` : "";
      this.dom.scoreIndicator.textContent = `得分: ${this.score}${streakText}`;
    } else {
      if (this.props.double <= 0) return;
      this.props.double--;
    }

    this.usedDoubleThisRound = true;

    if (window.birdAudioEngine) window.birdAudioEngine.playBonusSfx();
    this.updatePropsUI();
    this.updateBonusBannerUI();
  }

  // 更新顶部连胜与加成横幅
  updateBonusBannerUI() {
    if (!this.dom.bonusStatusBanner) return;
    const streakMult = this.getStreakMultiplier();
    const hasDoubleProp = this.usedDoubleThisRound;

    if (streakMult > 1 || hasDoubleProp) {
      this.dom.bonusStatusBanner.style.display = "flex";
      let parts = [];
      if (this.gameMode === "pokemon") {
        if (streakMult > 1) {
          parts.push(`🔥 连续答对 ${this.streak} 题！本题享受 ${streakMult} 倍连胜积分加成 (每5题多翻1倍)！`);
        }
      } else {
        if (streakMult === 4) {
          parts.push(`👑 连续答对 ${this.streak} 题！本题享受 4 倍超凡连击！`);
        } else if (streakMult === 2) {
          parts.push(`🔥 连续答对 ${this.streak} 题！本题享受 2 倍连胜翻倍！`);
        }
      }
      if (hasDoubleProp) {
        parts.push(`⚡ 已激活双倍计分道具 (×2)`);
      }
      this.dom.bonusText.textContent = parts.join(" · ");
    } else {
      this.dom.bonusStatusBanner.style.display = "none";
    }
  }

  // 切换屏幕视图
  showScreen(screenKey) {
    ["startScreen", "quizScreen", "summaryScreen"].forEach((k) => {
      if (this.dom[k]) {
        this.dom[k].classList.remove("active");
      }
    });
    if (this.dom[screenKey]) {
      this.dom[screenKey].classList.add("active");
    }
  }

  // 加载指定轮次的题目
  loadQuestion(index) {
    if (this.gameMode === "classic") {
      if (index >= this.questions.length) {
        this.finishGame();
        return;
      }
      this.dom.roundIndicator.textContent = `第 ${index + 1} / ${this.totalQuestions} 题`;
    } else if (this.gameMode === "pokemon") {
      if (this.lives <= 0) {
        this.finishGame();
        return;
      }
      this.dom.roundIndicator.textContent = `第 ${index + 1} 题 (宝可梦)`;
    } else {
      if (this.lives <= 0) {
        this.finishGame();
        return;
      }
      this.dom.roundIndicator.textContent = `第 ${index + 1} 题 (无尽)`;
    }

    this.currentRound = index;
    this.isAnswered = false;
    this.timeLimit = this.defaultTimeLimit;

    // 重置本题道具激活标记
    this.usedRemoveThisRound = false;
    this.usedTimeThisRound = false;
    this.usedDoubleThisRound = false;

    const currentQ = this.questions[index];
    const streakText = this.streak >= 2 ? ` 🔥${this.streak}` : "";
    this.dom.scoreIndicator.textContent = `得分: ${this.score}${streakText}`;
    
    this.updateLivesUI();
    this.updatePropsUI();
    this.updateBonusBannerUI();

    // 宝可梦模式专属遭遇横幅 (答题前保持神秘，避免泄露鸟名答案)
    if (this.gameMode === "pokemon" && window.birdPokemonSystem) {
      if (this.dom.pokemonEncounterBanner) {
        this.dom.pokemonEncounterBanner.style.display = "flex";
        this.dom.encounterText.textContent = "⚡ 野外遭遇未知神秘鸟类 · 倾听鸣声识别并捕获图鉴！";
        this.dom.encounterBondTag.style.display = "none";
      }
    } else {
      if (this.dom.pokemonEncounterBanner) {
        this.dom.pokemonEncounterBanner.style.display = "none";
      }
    }

    // 重置反馈、熟练度卡片与下一题按钮
    this.dom.feedbackCard.classList.remove("active", "success", "danger");
    if (this.dom.pokemonFeedbackContainer) {
      this.dom.pokemonFeedbackContainer.innerHTML = "";
    }
    this.dom.nextBtn.style.display = "none";
    this.dom.nextBtn.disabled = true;

    // 渲染 4 个选项按钮
    this.dom.optionsGrid.innerHTML = "";
    const tags = ["A", "B", "C", "D"];

    currentQ.options.forEach((optName, i) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerHTML = `
        <span class="option-tag">${tags[i]}</span>
        <span class="option-text">${optName}</span>
      `;
      btn.addEventListener("click", () => this.handleAnswer(optName, btn));
      this.dom.optionsGrid.appendChild(btn);
    });

    // 准备倒计时（严格等待音频真实播放才开始走秒，缓冲或未播放时不扣时间）
    this.isTimerStarted = false;
    this.isTimerPaused = false;
    this.clearTimer();
    this.timeLeft = this.timeLimit;
    this.questionStartTime = null;
    this.updateTimerUI();
    this.dom.timerText.textContent = `${this.timeLimit}s`;
    this.dom.audioStatusText.textContent = "🎧 正在加载野生鸟鸣录音，播放后开始计时...";

    // 自动播放鸟鸣音频
    if (window.birdAudioEngine) {
      window.birdAudioEngine.playBird(currentQ.bird);
    }
  }

  // 触发/恢复倒计时启动 (确保在音频产生真实声音后才正式走秒)
  triggerTimerStart() {
    if (this.isAnswered || !this.dom.quizScreen.classList.contains("active")) return;
    if (!this.isTimerStarted) {
      this.isTimerStarted = true;
      this.startTimer();
    } else if (this.isTimerPaused) {
      this.resumeTimer();
    }
  }

  // 启动倒计时
  startTimer() {
    this.clearTimer();
    this.isTimerPaused = false;
    if (!this.questionStartTime) {
      this.questionStartTime = Date.now();
    }
    this.updateTimerUI();

    this.timerInterval = setInterval(() => {
      if (this.isTimerPaused) return;

      this.timeLeft -= 0.1;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.clearTimer();
        this.handleTimeout();
      }
      this.updateTimerUI();
    }, 100);
  }

  // 音频缓冲中：自动暂停倒计时走秒
  pauseTimer() {
    if (!this.isTimerStarted || this.isAnswered) return;
    this.isTimerPaused = true;
  }

  // 音频恢复播放：恢复倒计时走秒
  resumeTimer() {
    if (!this.isTimerStarted || this.isAnswered) return;
    this.isTimerPaused = false;
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isTimerPaused = false;
    if (this.audioFallbackTimer) {
      clearTimeout(this.audioFallbackTimer);
      this.audioFallbackTimer = null;
    }
  }

  updateTimerUI() {
    const formatted = Math.ceil(this.timeLeft);
    this.dom.timerText.textContent = `${formatted}s`;
    const percent = (this.timeLeft / this.timeLimit) * 100;
    this.dom.timerBar.style.width = `${Math.max(0, percent)}%`;

    if (this.timeLeft <= 5) {
      this.dom.timerText.classList.add("urgent");
      this.dom.timerBar.classList.add("urgent");
    } else {
      this.dom.timerText.classList.remove("urgent");
      this.dom.timerBar.classList.remove("urgent");
    }
  }

  // 处理用户作答
  handleAnswer(selectedName, clickedBtn) {
    if (this.isAnswered) return;
    this.isAnswered = true;
    this.clearTimer();
    this.updatePropsUI();

    const currentQ = this.questions[this.currentRound];
    const duration = this.questionStartTime
      ? ((Date.now() - this.questionStartTime) / 1000).toFixed(1)
      : "0.5";
    const timeNum = parseFloat(duration);
    const isCorrect = selectedName === currentQ.correctAnswer;

    // 禁用所有选项按钮
    const allButtons = this.dom.optionsGrid.querySelectorAll(".option-btn");
    allButtons.forEach((btn) => (btn.disabled = true));

    let earnedScore = 0;
    let streakMult = 1;
    let propMult = 1;
    let speedBonus = 0;
    let pokemonResult = null;

    if (isCorrect) {
      // 1. 获取本题连胜倍率
      streakMult = this.getStreakMultiplier();
      // 2. 双倍道具倍率
      propMult = this.usedDoubleThisRound ? 2 : 1;
      // 3. 快速答题奖励：5 秒内答对 +5 分
      if (timeNum <= 5.0) {
        speedBonus = 5;
      }

      earnedScore = this.pointsPerQuestion * streakMult * propMult + speedBonus;
      this.score += earnedScore;

      this.streak++;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;

      const streakText = this.streak >= 2 ? ` 🔥${this.streak}` : "";
      this.dom.scoreIndicator.textContent = `得分: ${this.score}${streakText}`;
      clickedBtn.classList.add("correct");

      // 宝可梦模式累计熟练度与星级
      if (this.gameMode === "pokemon" && window.birdPokemonSystem) {
        pokemonResult = window.birdPokemonSystem.recordCorrectAnswer(currentQ.bird);
        this.updateTrainerStatusUI();
      }

      if (pokemonResult && pokemonResult.isLevelUp) {
        if (window.birdAudioEngine) window.birdAudioEngine.playFanfareSfx();
      } else if (streakMult > 1 || propMult > 1 || speedBonus > 0) {
        if (window.birdAudioEngine) window.birdAudioEngine.playBonusSfx();
      } else {
        if (window.birdAudioEngine) window.birdAudioEngine.playSuccessSfx();
      }

      this.showFeedback(true, currentQ.bird, selectedName, {
        earnedScore,
        streakMult,
        propMult,
        speedBonus,
        duration: timeNum,
        streak: this.streak,
        pokemonResult
      });
    } else {
      // 答错时连胜中断
      this.streak = 0;
      if (this.gameMode === "endless" || this.gameMode === "pokemon") {
        this.lives--;
        this.updateLivesUI();
      }
      this.dom.scoreIndicator.textContent = `得分: ${this.score}`;
      clickedBtn.classList.add("wrong");
      allButtons.forEach((btn) => {
        const text = btn.querySelector(".option-text").textContent;
        if (text === currentQ.correctAnswer) {
          btn.classList.add("correct-reveal");
        }
      });
      if (window.birdAudioEngine) window.birdAudioEngine.playErrorSfx();
      this.showFeedback(false, currentQ.bird, selectedName);
    }

    // 记录答题历史
    this.history.push({
      round: this.currentRound + 1,
      bird: currentQ.bird,
      options: currentQ.options,
      userAnswer: selectedName,
      correctAnswer: currentQ.correctAnswer,
      isCorrect: isCorrect,
      timeSpent: timeNum,
      earnedScore: earnedScore,
      streakMult: streakMult,
      propMult: propMult,
      speedBonus: speedBonus,
      pokemonResult: pokemonResult
    });

    // 展现下一题按钮
    this.dom.nextBtn.style.display = "flex";
    this.dom.nextBtn.disabled = false;

    if (this.gameMode === "classic") {
      this.dom.nextBtn.textContent =
        this.currentRound + 1 >= this.totalQuestions
          ? "查看总成绩结算 🏆 (Enter)"
          : "下一题 → (Enter)";
    } else {
      if (this.lives <= 0) {
        this.dom.nextBtn.textContent = "机会用尽，查看战报 🏁 (Enter)";
      } else {
        this.dom.nextBtn.textContent = `下一题 → (剩余 ❤️ ${this.lives}) (Enter)`;
      }
    }
  }

  // 处理答题超时
  handleTimeout() {
    if (this.isAnswered) return;
    this.isAnswered = true;
    this.updatePropsUI();

    const currentQ = this.questions[this.currentRound];
    const allButtons = this.dom.optionsGrid.querySelectorAll(".option-btn");
    allButtons.forEach((btn) => {
      btn.disabled = true;
      const text = btn.querySelector(".option-text").textContent;
      if (text === currentQ.correctAnswer) {
        btn.classList.add("correct-reveal");
      }
    });

    this.streak = 0;
    if (this.gameMode === "endless" || this.gameMode === "pokemon") {
      this.lives--;
      this.updateLivesUI();
    }
    this.dom.scoreIndicator.textContent = `得分: ${this.score}`;

    if (window.birdAudioEngine) window.birdAudioEngine.playErrorSfx();
    this.showFeedback(false, currentQ.bird, "超时未作答");

    this.history.push({
      round: this.currentRound + 1,
      bird: currentQ.bird,
      options: currentQ.options,
      userAnswer: "超时未作答",
      correctAnswer: currentQ.correctAnswer,
      isCorrect: false,
      timeSpent: this.timeLimit,
      earnedScore: 0
    });

    this.dom.nextBtn.style.display = "flex";
    this.dom.nextBtn.disabled = false;

    if (this.gameMode === "classic") {
      this.dom.nextBtn.textContent =
        this.currentRound + 1 >= this.totalQuestions
          ? "查看总成绩结算 🏆 (Enter)"
          : "下一题 → (Enter)";
    } else {
      if (this.lives <= 0) {
        this.dom.nextBtn.textContent = "机会用尽，查看战报 🏁 (Enter)";
      } else {
        this.dom.nextBtn.textContent = `下一题 → (剩余 ❤️ ${this.lives}) (Enter)`;
      }
    }
  }

  // 展示题目反馈与鸟类卡片
  showFeedback(isCorrect, bird, userAnswer, extra = null) {
    this.dom.feedbackCard.classList.add("active");
    if (isCorrect && extra) {
      this.dom.feedbackCard.classList.add("success");
      
      let breakdownHtml = `<div class="breakdown-tags">`;
      breakdownHtml += `<span class="breakdown-tag tag-base">基础 +10分</span>`;
      if (extra.streakMult > 1) {
        breakdownHtml += `<span class="breakdown-tag tag-streak">🔥 连胜加成 ×${extra.streakMult}</span>`;
      }
      if (extra.propMult > 1) {
        breakdownHtml += `<span class="breakdown-tag tag-prop">⚡ 双倍道具 ×2</span>`;
      }
      if (extra.speedBonus > 0) {
        breakdownHtml += `<span class="breakdown-tag tag-speed">⚡ 极速答题 (${extra.duration}s) +5分</span>`;
      }

      // 宝可梦模式标签
      if (extra.pokemonResult) {
        const pr = extra.pokemonResult;
        breakdownHtml += `<span class="breakdown-tag tag-speed" style="background:rgba(2,132,199,0.3); border-color:#38bdf8; color:#e0f2fe;">⚡ 熟练度 +1 (${pr.count}次)</span>`;
        if (pr.isLevelUp) {
          breakdownHtml += `<span class="breakdown-tag tag-streak" style="background:linear-gradient(135deg, #f59e0b, #ec4899); color:#ffffff;">🌟 恭喜升级至 ${'⭐'.repeat(pr.newStars)}！(+${pr.newStars * 50}EXP)</span>`;
        }
        if (pr.newBondUnlocked) {
          breakdownHtml += `<span class="breakdown-tag tag-prop" style="background:linear-gradient(135deg, #a855f7, #ec4899); color:#ffffff;">✨ 激活【${pr.newBondUnlocked.orderFamily}】专属羁绊卡！</span>`;
        }
      }

      breakdownHtml += `</div>`;

      this.dom.feedbackTitle.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:4px; width:100%;">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <span>🎉 恭喜回答正确！</span>
            <span class="points-badge">+${extra.earnedScore} 分</span>
          </div>
          ${breakdownHtml}
        </div>
      `;
    } else {
      this.dom.feedbackCard.classList.add("danger");
      const livesWarning =
        (this.gameMode === "endless" || this.gameMode === "pokemon")
          ? this.lives > 0
            ? `<span style="font-size:12px; color:var(--rose-400); margin-left:8px;">(扣除 1 颗心，剩余 ❤️ ${this.lives})</span>`
            : `<span style="font-size:12px; color:var(--rose-400); font-weight:bold; margin-left:8px;">(3 次容错机会已耗尽！)</span>`
          : "";
      this.dom.feedbackTitle.innerHTML = `<span>❌ 回答错误</span> <span style="font-size: 13px; color: var(--rose-400); font-weight: 500;">你的选择：${userAnswer}</span>${livesWarning}`;
    }

    this.dom.feedbackBirdName.textContent = bird.name;
    this.dom.feedbackBirdLatin.textContent = `${bird.latin} · ${bird.orderFamily || bird.family || bird.category} · ${bird.category}`;
    this.dom.feedbackVoice.innerHTML = `<strong>【鸣声特征】</strong>${bird.voiceFeatures || "具备专属野生啼鸣特征"}`;
    this.dom.feedbackFact.innerHTML = `<strong>【栖息环境】</strong>${bird.habitat || "全国分布"} ${bird.recordist ? `· 录音来自: ${bird.recordist}` : ""}`;

    // 宝可梦模式专属：作答结束后揭晓并展示该鸟类熟练度进度条与星级
    if (this.gameMode === "pokemon" && window.birdPokemonSystem) {
      const status = window.birdPokemonSystem.getBirdStatus(bird);
      const starsText = status.stars > 0 ? "⭐".repeat(status.stars) : "未点亮图鉴";

      // 1. 同步更新顶部遭遇条
      if (this.dom.pokemonEncounterBanner) {
        this.dom.pokemonEncounterBanner.style.display = "flex";
        if (isCorrect) {
          this.dom.encounterText.textContent = `🎯 遭遇识别成功：【${bird.name}】 ${starsText} · 熟练度: ${status.count}/${status.nextThreshold} 次`;
        } else {
          this.dom.encounterText.textContent = `🎯 本题目标鸟类：【${bird.name}】 ${starsText} · 熟练度: ${status.count}/${status.nextThreshold} 次 (未获得熟练度)`;
        }
        if (status.isBonded) {
          this.dom.encounterBondTag.style.display = "inline-block";
          this.dom.encounterBondTag.textContent = `✨ 【${bird.orderFamily}】同科羁绊共鸣生效：仅需 3 次升级！`;
        } else {
          this.dom.encounterBondTag.style.display = "none";
        }
      }

      // 2. 在反馈卡片中插入直观的 EXP 进度条与升级所需次数
      if (this.dom.pokemonFeedbackContainer) {
        const nextDiff = Math.max(0, status.nextThreshold - status.count);
        this.dom.pokemonFeedbackContainer.innerHTML = `
          <div class="pokemon-feedback-progress">
            <div class="pfp-header">
              <span>⚡ 宝可梦图鉴熟练度：【${bird.name}】</span>
              <span class="pfp-stars">${starsText}</span>
            </div>
            <div class="exp-bar-track" style="margin: 6px 0;">
              <div class="exp-bar-fill" style="width: ${status.progressPercent}%;"></div>
            </div>
            <div class="pfp-footer">
              <span>${isCorrect ? `✓ 熟练度 +1 (当前答对: ${status.count} 次)` : `✗ 当前答对: ${status.count} 次`}</span>
              <span>${status.isMax ? "已达 3★ 满星" : `升级还需: ${nextDiff} 次`}${status.isBonded ? " (⚡ 羁绊加速)" : ""}</span>
            </div>
          </div>
        `;
      }
    }
  }

  // 下一题推进
  goToNextQuestion() {
    if (this.gameMode === "classic") {
      if (this.currentRound + 1 >= this.totalQuestions) {
        this.finishGame();
      } else {
        this.loadQuestion(this.currentRound + 1);
      }
    } else {
      // 无尽生存模式与宝可梦大师模式
      if (this.lives <= 0) {
        this.finishGame();
      } else {
        const nextIndex = this.currentRound + 1;
        if (nextIndex >= this.questions.length) {
          const poolBirds = this.getPoolBirds();
          if (this.poolIndex >= this.shuffledPool.length) {
            this.shuffledPool = [...poolBirds].sort(() => Math.random() - 0.5);
            this.poolIndex = 0;
          }
          const nextTarget = this.shuffledPool[this.poolIndex++];
          this.questions.push(this.createSingleQuestion(nextTarget, poolBirds));
        }
        this.loadQuestion(nextIndex);
      }
    }
  }

  // 结算游戏总成绩
  finishGame() {
    this.clearTimer();

    // 1. 优先切换并渲染结果屏幕
    this.showScreen("summaryScreen");
    this.renderSummary();

    // 2. 音频收尾与胜利音效
    try {
      if (window.birdAudioEngine) {
        window.birdAudioEngine.stop();
        if (this.score >= 80) {
          window.birdAudioEngine.playVictoryFanfare();
        }
      }
    } catch (e) {
      console.warn("Audio fanfare error:", e);
    }

    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {}
  }

  // 渲染结算界面
  renderSummary() {
    try {
      const correctCount = this.history.filter((h) => h.isCorrect).length;
      const totalAnswered = this.history.length;
      const accuracy =
        totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
      const avgTime =
        totalAnswered > 0
          ? (
              this.history.reduce((acc, cur) => acc + (cur.timeSpent || 0), 0) /
              totalAnswered
            ).toFixed(1)
          : "0.0";

      const poolLabelMap = {
        all: "全部生境",
        forest: "林鸟题库",
        water: "水鸟题库"
      };
      const diffLabelMap = {
        easy: "简单(前20%)",
        normal: "普通(前50%)",
        hard: "困难(全量)"
      };
      const regLabelMap = {
        all: "全国",
        north: "华北",
        northeast: "东北",
        east: "华东",
        central: "华中",
        south: "华南",
        southwest: "西南",
        northwest: "西北"
      };

      const poolName = poolLabelMap[this.selectedPool] || "全部生境";
      const diffName = diffLabelMap[this.selectedDifficulty] || "困难";
      const areaName =
        this.selectedProvince && this.selectedProvince !== "all"
          ? `${this.selectedProvince}`
          : regLabelMap[this.selectedRegion] || "全国";
      const fullMetaBadge = `${areaName} · ${diffName} · ${poolName}`;

      if (this.dom.summaryModeBadge) {
        if (this.gameMode === "classic") {
          this.dom.summaryModeBadge.textContent = `🎯 经典 10 题挑战 · ${fullMetaBadge}`;
        } else if (this.gameMode === "pokemon") {
          this.dom.summaryModeBadge.textContent = `⚡ 宝可梦大师挑战 · ${fullMetaBadge}`;
        } else {
          this.dom.summaryModeBadge.textContent = `♾️ 无尽生存挑战 · ${fullMetaBadge}`;
        }
      }

      if (this.dom.finalScore) this.dom.finalScore.textContent = this.score;

      if (this.dom.finalScoreUnit) {
        this.dom.finalScoreUnit.textContent =
          this.gameMode === "classic" ? "分 (满分100+加分)" : "分 (总得分)";
      }

      if (this.dom.statCorrect) {
        this.dom.statCorrect.textContent =
          this.gameMode === "classic"
            ? `${correctCount} / ${this.totalQuestions}`
            : `${correctCount} / ${totalAnswered}`;
      }

      if (this.dom.statCorrectLabel) {
        this.dom.statCorrectLabel.textContent =
          this.gameMode === "classic" ? "答对题数" : `答对 / 坚持题数`;
      }

      if (this.dom.statAccuracy) this.dom.statAccuracy.textContent = `${accuracy}%`;

      if (this.dom.statAvgTime) {
        this.dom.statAvgTime.textContent =
          this.gameMode === "classic" ? `${avgTime}s` : `🔥 ${this.maxStreak} 连胜`;
      }

      if (this.dom.statExtraLabel) {
        this.dom.statExtraLabel.textContent =
          this.gameMode === "classic" ? "平均答题速度" : "最高连胜纪录";
      }

      // 称号与评价系统
      const badgeEl = this.dom.scoreBadge;
      const textEl = this.dom.scoreSummaryText;

      if (badgeEl && textEl) {
        badgeEl.className = "score-badge";

        if (this.gameMode === "classic") {
          if (this.score >= 100) {
            badgeEl.classList.add("badge-gold");
            badgeEl.textContent = "🌟 观鸟宗师 · 金牌听音师";
            textEl.textContent =
              "耳聪目明，无与伦比！你对中国大自然的鸟鸣声了如指掌，听音辨鸟已达宗师境界！";
          } else if (this.score >= 80) {
            badgeEl.classList.add("badge-gold");
            badgeEl.textContent = "🥈 资深观鸟达人";
            textEl.textContent =
              "非常出色的表现！你熟悉大部分中国常见鸟类的叫声，已是一位出色的自然侦听家！";
          } else if (this.score >= 60) {
            badgeEl.classList.add("badge-teal");
            badgeEl.textContent = "🥉 进阶自然探索者";
            textEl.textContent =
              "表现合格！你能够分辨常见鸟类的声音，多加重听复盘，向观鸟高手进阶吧！";
          } else {
            badgeEl.classList.add("badge-blue");
            badgeEl.textContent = "🌱 初出茅庐观鸟萌新";
            textEl.textContent =
              "鸟鸣千变万化，多在 500 鸟类大百科中试听原声、观察特征，下次一定会取得好成绩！";
          }
        } else if (this.gameMode === "pokemon") {
          if (this.score >= 200) {
            badgeEl.classList.add("badge-gold");
            badgeEl.textContent = "👑 传奇宝可梦大师 · 鸟鸣收割者";
            textEl.textContent = `无与伦比的训练家功力！成功斩获 ${this.score} 高分，收获大量鸟类图鉴经验与星级！快去宝可梦图鉴大厅查看羁绊！`;
          } else if (this.score >= 100) {
            badgeEl.classList.add("badge-teal");
            badgeEl.textContent = "⚡ 高阶宝可梦大师 · 听音猎手";
            textEl.textContent = `斩获 ${this.score} 分并收获 ${this.maxStreak} 连胜！成功升级了多个鸟类的图鉴熟练度！`;
          } else {
            badgeEl.classList.add("badge-blue");
            badgeEl.textContent = "🌱 新星宝可梦训练家";
            textEl.textContent = "已将本次遭遇的鸟类熟练度计入全生涯图鉴！多在图鉴大厅研究羁绊，升级更轻松！";
          }
        } else {
          // 无尽生存模式
          if (this.score >= 300) {
            badgeEl.classList.add("badge-gold");
            badgeEl.textContent = "👑 听音封神 · 绝世声学泰斗";
            textEl.textContent = `太震撼了！在 3 次容错的高压下坚持答对 ${correctCount} 题，斩获 ${this.score} 高分，最高连胜 ${this.maxStreak} 次，辨音功力超凡入圣！`;
          } else if (this.score >= 200) {
            badgeEl.classList.add("badge-gold");
            badgeEl.textContent = "🌟 观鸟宗师 · 金牌听音专家";
            textEl.textContent = `登峰造极的野外侦听功力！在无尽挑战中斩获 ${this.score} 分，绝大多数野生鸟鸣都难逃你的金耳朵！`;
          } else if (this.score >= 100) {
            badgeEl.classList.add("badge-teal");
            badgeEl.textContent = "🦅 资深自然侦听达人";
            textEl.textContent = `实力强劲！成功拿下 ${this.score} 分并取得 ${this.maxStreak} 连胜，对鸟鸣有极高的敏锐度和扎实的辨识功底！`;
          } else {
            badgeEl.classList.add("badge-blue");
            badgeEl.textContent = "🌱 探索者萌新";
            textEl.textContent = "善用三大强力道具，熟悉鸟鸣特征，再次挑战极限！";
          }
        }
      }

      this.renderReviewList();
    } catch (err) {
      console.error("renderSummary error:", err);
    }
  }

  // 渲染逐题复盘列表
  renderReviewList() {
    if (!this.dom.reviewList) return;
    this.dom.reviewList.innerHTML = "";

    this.history.forEach((item) => {
      try {
        const card = document.createElement("div");
        card.className = "review-item" + (item.isCorrect ? " is-correct" : " is-wrong");

        const birdName = item.bird?.name || "未知鸟类";
        const birdLatin = item.bird?.latin || "";
        const birdFam = item.bird?.orderFamily || item.bird?.family || item.bird?.category || "";
        const birdVoice = item.bird?.voiceFeatures || "具备物种专属真实野生啼鸣特征";

        let scoreTagText = item.isCorrect ? `✓ 答对 (+${item.earnedScore || 10}分)` : "✗ 答错 (0分)";

        let extraPokemonInfo = "";
        if (item.pokemonResult) {
          const pr = item.pokemonResult;
          extraPokemonInfo = `<div style="font-size:11px; color:#38bdf8; margin-top:2px;">⚡ 熟练度: ${pr.count}次 | 星级: ${'⭐'.repeat(pr.newStars) || '0星'}</div>`;
        }

        card.innerHTML = `
          <div class="review-status-tag ${item.isCorrect ? "tag-correct" : "tag-wrong"}">
            ${scoreTagText}
          </div>
          <div class="review-meta">
            <div class="review-bird-name">第 ${item.round} 题：${birdName}</div>
            <div class="review-bird-latin">${birdLatin} · ${birdFam}</div>
            <div class="review-detail"><strong>鸣声特征：</strong>${birdVoice}</div>
            <div class="review-detail"><strong>你的回答：</strong>${item.userAnswer} ${item.isCorrect ? "" : `(正确答案：<span style="color:var(--emerald-400); font-weight:600;">${item.correctAnswer}</span>)`} · 耗时 ${item.timeSpent}s</div>
            ${extraPokemonInfo}
          </div>
          <div class="review-actions">
            <button class="review-audio-btn">
              <span>🔊</span>
              <span>重听原声</span>
            </button>
          </div>
        `;

        const audioBtn = card.querySelector(".review-audio-btn");
        if (audioBtn) {
          audioBtn.addEventListener("click", () => {
            if (window.birdAudioEngine && item.bird) {
              window.birdAudioEngine.playBird(item.bird);
            }
          });
        }

        this.dom.reviewList.appendChild(card);
      } catch (e) {
        console.warn("Error rendering review item:", e);
      }
    });
  }

  // 渲染宝可梦大师图鉴 (500 种星级卡片)
  renderPokemonDex() {
    if (!this.dom.pokemonGrid || !window.birdPokemonSystem) return;
    this.dom.pokemonGrid.innerHTML = "";

    const allBirds = Array.isArray(BIRDS_500_DATA) ? BIRDS_500_DATA : [];

    // 1. 星级与羁绊筛选
    let filtered = allBirds.filter((b) => {
      const status = window.birdPokemonSystem.getBirdStatus(b);
      if (this.pokemonStarFilter === "3") return status.stars === 3;
      if (this.pokemonStarFilter === "2") return status.stars === 2;
      if (this.pokemonStarFilter === "1") return status.stars === 1;
      if (this.pokemonStarFilter === "0") return status.stars === 0;
      if (this.pokemonStarFilter === "bonded") return status.isBonded;
      return true;
    });

    // 2. 关键词搜索
    if (this.pokemonKeyword) {
      const k = this.pokemonKeyword.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(k) ||
          b.latin.toLowerCase().includes(k) ||
          (b.pinyin && b.pinyin.toLowerCase().includes(k)) ||
          (b.orderFamily && b.orderFamily.toLowerCase().includes(k)) ||
          (b.category && b.category.toLowerCase().includes(k))
      );
    }

    // 3. 分页
    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / this.pokemonPageSize));
    if (this.pokemonPage > totalPages) this.pokemonPage = totalPages;
    if (this.pokemonPage < 1) this.pokemonPage = 1;

    const startIdx = (this.pokemonPage - 1) * this.pokemonPageSize;
    const pageItems = filtered.slice(startIdx, startIdx + this.pokemonPageSize);

    if (this.dom.pokemonPageInfo) {
      this.dom.pokemonPageInfo.textContent = `第 ${this.pokemonPage} / ${totalPages} 页 (共 ${totalCount} 种)`;
    }
    if (this.dom.pokemonPrevPage) this.dom.pokemonPrevPage.disabled = this.pokemonPage <= 1;
    if (this.dom.pokemonNextPage) this.dom.pokemonNextPage.disabled = this.pokemonPage >= totalPages;

    if (pageItems.length === 0) {
      this.dom.pokemonGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-dim);">
          🔍 未找到匹配星级的鸟类图鉴
        </div>
      `;
      return;
    }

    pageItems.forEach((bird) => {
      const status = window.birdPokemonSystem.getBirdStatus(bird);
      const card = document.createElement("div");
      card.className = `pokemon-card star-${status.stars}`;

      let starDisplay = "";
      for (let s = 1; s <= 3; s++) {
        starDisplay += s <= status.stars ? "⭐" : "☆";
      }

      let bondBadgeHtml = "";
      if (status.isBonded) {
        bondBadgeHtml = `<div class="pokemon-bond-badge">⚡ 羁绊共鸣 (升级需3次)</div>`;
      }

      card.innerHTML = `
        <div class="pokemon-card-header">
          <span class="pokemon-stars">${starDisplay}</span>
          <span style="font-size:11px; color:var(--text-dim);">${bird.category}</span>
        </div>
        <div class="pokemon-card-name">${bird.name}</div>
        <div class="pokemon-card-latin">${bird.latin} · ${bird.orderFamily || ""}</div>

        <div class="exp-section">
          <div class="exp-label-row">
            <span>熟练度: ${status.count} 次</span>
            <span>${status.isMax ? "已满星" : `目标: ${status.nextThreshold} 次`}</span>
          </div>
          <div class="exp-bar-track">
            <div class="exp-bar-fill" style="width: ${status.progressPercent}%;"></div>
          </div>
        </div>

        ${bondBadgeHtml}

        <button class="dex-audio-btn" style="margin-top:10px;">🔊 试听野生原声</button>
      `;

      const audioBtn = card.querySelector(".dex-audio-btn");
      audioBtn.addEventListener("click", () => {
        window.birdAudioEngine.playBird(bird);
      });

      this.dom.pokemonGrid.appendChild(card);
    });
  }

  // 渲染同科羁绊殿堂
  renderBondsHall() {
    if (!this.dom.bondsGrid || !window.birdPokemonSystem) return;
    this.dom.bondsGrid.innerHTML = "";

    const families = window.birdPokemonSystem.getAllFamilyBondsProgress();

    families.forEach((fam) => {
      const card = document.createElement("div");
      card.className = `bond-card ${fam.isUnlocked ? "unlocked" : ""}`;

      const progressPercent = Math.min(100, Math.round((fam.star1Count / 5) * 100));

      let pillsHtml = `<div class="bond-species-pills">`;
      fam.birds.forEach((b) => {
        const p = window.birdPokemonSystem.data.proficiency[b.name];
        const hasStar = p && p.stars >= 1;
        pillsHtml += `<span class="bond-species-pill ${hasStar ? "has-star" : ""}">
          ${hasStar ? "⭐ " : ""}${b.name}
        </span>`;
      });
      pillsHtml += `</div>`;

      card.innerHTML = `
        <div class="bond-card-header">
          <div class="bond-card-title">${fam.name}</div>
          <div class="bond-status-tag">
            ${fam.isUnlocked ? "⚡ 羁绊共鸣达成" : `${fam.star1Count} / 5 种`}
          </div>
        </div>

        <div class="exp-section" style="margin: 2px 0 6px;">
          <div class="exp-label-row">
            <span>1★ 鸟类收集进度: ${fam.star1Count} / 5 (共 ${fam.birds.length} 种)</span>
            <span>${fam.isUnlocked ? "特权已激活" : `还需 ${Math.max(0, 5 - fam.star1Count)} 种`}</span>
          </div>
          <div class="exp-bar-track">
            <div class="exp-bar-fill" style="width: ${progressPercent}%; ${fam.isUnlocked ? "background:linear-gradient(90deg, #f59e0b, #10b981);" : ""}"></div>
          </div>
        </div>

        ${fam.isUnlocked ? `<div style="font-size:12px; color:var(--amber-300); font-weight:700;">✨ 特权：该科所有鸟类提升星级所需答对次数减少至 3 次！</div>` : `<div style="font-size:11px; color:var(--text-dim);">收集科内任意 5 种达到 1 星即可激活羁绊特权</div>`}

        ${pillsHtml}
      `;

      this.dom.bondsGrid.appendChild(card);
    });
  }

  // 渲染 500 鸟类自然大百科图鉴
  renderBirdDex() {
    if (!this.dom.dexGrid) return;
    this.dom.dexGrid.innerHTML = "";

    const allBirds = Array.isArray(BIRDS_500_DATA) ? BIRDS_500_DATA : CORE_QUIZ_BIRDS;

    let filtered = allBirds;
    if (this.dexCategory && this.dexCategory !== "all") {
      filtered = filtered.filter((b) => b.category === this.dexCategory);
    }

    if (this.dexKeyword) {
      const k = this.dexKeyword.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(k) ||
          b.latin.toLowerCase().includes(k) ||
          (b.pinyin && b.pinyin.toLowerCase().includes(k)) ||
          (b.orderFamily && b.orderFamily.toLowerCase().includes(k)) ||
          (b.category && b.category.toLowerCase().includes(k)) ||
          (b.habitat && b.habitat.toLowerCase().includes(k))
      );
    }

    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / this.dexPageSize));
    if (this.dexPage > totalPages) this.dexPage = totalPages;
    if (this.dexPage < 1) this.dexPage = 1;

    const startIdx = (this.dexPage - 1) * this.dexPageSize;
    const pageItems = filtered.slice(startIdx, startIdx + this.dexPageSize);

    if (this.dom.pageInfo) {
      this.dom.pageInfo.textContent = `第 ${this.dexPage} / ${totalPages} 页 (共 ${totalCount} 种)`;
    }
    if (this.dom.prevPageBtn) {
      this.dom.prevPageBtn.disabled = this.dexPage <= 1;
    }
    if (this.dom.nextPageBtn) {
      this.dom.nextPageBtn.disabled = this.dexPage >= totalPages;
    }

    if (pageItems.length === 0) {
      this.dom.dexGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-dim);">
          🔍 未找到匹配的鸟类，请尝试输入其他关键词或切换分类
        </div>
      `;
      return;
    }

    pageItems.forEach((bird, i) => {
      const globalIdx = startIdx + i + 1;
      const hasAudio = CORE_QUIZ_BIRDS.some((cb) => cb.name === bird.name);
      const item = document.createElement("div");
      item.className = "dex-card" + (hasAudio ? " has-audio" : "");

      const diffTag = bird.commonTier === "easy"
        ? `<span style="color:#34d399; font-weight:700; font-size:11px;">🌱 简单(前20%)</span>`
        : (bird.commonTier === "normal"
          ? `<span style="color:#38bdf8; font-weight:700; font-size:11px;">🌿 普通(前50%)</span>`
          : `<span style="color:#f59e0b; font-weight:700; font-size:11px;">🦅 困难(全量)</span>`);

      const provText = Array.isArray(bird.provinces) && bird.provinces.length > 0
        ? (bird.provinces.includes("全国") ? "全国分布" : bird.provinces.slice(0, 4).join("、") + (bird.provinces.length > 4 ? "等" : ""))
        : (bird.habitat || "全国分布");

      item.innerHTML = `
        <div class="dex-card-top">
          <span class="dex-index">#${String(globalIdx).padStart(3, "0")}</span>
          <span class="dex-family">${bird.orderFamily || bird.family || bird.category}</span>
        </div>
        <h4 class="dex-name">${bird.name}</h4>
        <div class="dex-latin">${bird.latin} · ${diffTag}</div>
        <div class="dex-category">${bird.category} · 📍 ${provText}</div>
        ${
          hasAudio
            ? `<button class="dex-audio-btn">🔊 试听原声</button>`
            : `<span class="dex-status">🎧 题库干扰项 / 音频采集中</span>`
        }
      `;

      if (hasAudio) {
        const audioBtn = item.querySelector(".dex-audio-btn");
        audioBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const target = CORE_QUIZ_BIRDS.find((cb) => cb.name === bird.name) || bird;
          window.birdAudioEngine.playBird(target);
        });
      }

      this.dom.dexGrid.appendChild(item);
    });
  }

  // 更新播放按钮视觉状态并与倒计时联动
  updateAudioButtonUI(state, payload) {
    if (this.dom.playAudioBtn) {
      if (state === "loading") {
        // 音频正在缓冲：自动暂停倒计时走秒，避免网络吃掉用户答题时间
        this.pauseTimer();

        this.dom.playAudioBtn.classList.remove("playing");
        this.dom.playAudioBtn.innerHTML = `
          <span class="play-icon">⏳</span>
          <span>正在缓冲音频...</span>
        `;
        if (!this.isAnswered) {
          if (this.isTimerStarted) {
            this.dom.audioStatusText.textContent = "⏳ 音频网络缓冲中，倒计时已为您自动暂停...";
          } else {
            this.dom.audioStatusText.textContent = "🎧 正在加载野生鸟鸣录音，播放后开始计时...";
          }
        }
      } else if (payload && payload.isPlaying) {
        // 音频真实开始播放：启动/恢复倒计时走秒！
        this.triggerTimerStart();

        this.dom.playAudioBtn.classList.add("playing");
        this.dom.playAudioBtn.innerHTML = `
          <span class="play-icon wave-anim">⏸️</span>
          <span>正在播放真实鸟鸣... (点击暂停)</span>
        `;
        if (this.isAnswered) {
          this.dom.audioStatusText.textContent = `正在播放【${payload.bird ? payload.bird.name : "野外鸟鸣"}】真实录音`;
        } else {
          this.dom.audioStatusText.textContent = "🔊 正在播放野外真实鸟鸣... (作答后揭晓学名)";
        }
      } else if (state === "paused") {
        this.dom.playAudioBtn.classList.remove("playing");
        this.dom.playAudioBtn.innerHTML = `
          <span class="play-icon">▶️</span>
          <span>重播真实鸟鸣 (空格键)</span>
        `;
        if (!this.isAnswered && !this.isTimerStarted) {
          this.dom.audioStatusText.textContent = "▶️ 音频已就绪，点击播放按钮开始答题";
        } else if (!this.isAnswered) {
          this.dom.audioStatusText.textContent = "音频已就绪 · 可按键盘 1/2/3/4 作答";
        }
      } else {
        this.dom.playAudioBtn.classList.remove("playing");
        this.dom.playAudioBtn.innerHTML = `
          <span class="play-icon">▶️</span>
          <span>重播真实鸟鸣 (空格键)</span>
        `;
        if (!this.isAnswered) {
          this.dom.audioStatusText.textContent = "音频已就绪 · 可按键盘 1/2/3/4 作答";
        }
      }
    }
  }
}

// 页面加载完成后实例化游戏
window.addEventListener("DOMContentLoaded", () => {
  window.birdGame = new BirdQuizGame();
});
