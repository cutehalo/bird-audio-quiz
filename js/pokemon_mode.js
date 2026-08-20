/**
 * 听音识鸟 - 宝可梦模式核心系统 (PokemonSystem)
 * 1. 每日 5 点体力限制，少于 5 点时每 3 小时自动恢复 1 点
 * 2. 熟练度与指数经验曲线收集：答对累计提升星级 (⭐ 1星 / ⭐⭐ 2星 / ⭐⭐⭐ 3星)
 * 3. 同目同科羁绊系统：科内收集 ≥ 5 张 1星卡激活羁绊卡，激活后升级所需答对次数减少至 3 次
 * 4. 全生涯数据持久化存储 (localStorage)
 */

class BirdPokemonSystem {
  constructor() {
    this.STORAGE_KEY = "bird_audio_pokemon_save_v1";
    this.MAX_STAMINA = 5;
    this.RECOVER_INTERVAL = 3 * 60 * 60 * 1000; // 3 小时恢复 1 点体力 (毫秒)
    this.BOND_THRESHOLD = 5; // 同科收集 5 张 1 星卡激活羁绊

    this.data = this.loadData();
    this.updateStamina();
  }

  // 加载持久化数据
  loadData() {
    const defaultData = {
      stamina: 5,
      lastRecoverTimestamp: Date.now(),
      trainerExp: 0,
      trainerLevel: 1,
      // 精灵球背包 (normal: 普通球 10%, great: 高级球 20%, master: 大师球 30%)
      pokeBalls: {
        normal: 0,
        great: 0,
        master: 0
      },
      // birdId -> { count: number, stars: number, lastDate: number }
      proficiency: {},
      // Array of orderFamily strings that have unlocked bonds
      unlockedBonds: []
    };

    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultData,
          ...parsed,
          pokeBalls: {
            normal: 0,
            great: 0,
            master: 0,
            ...(parsed.pokeBalls || {})
          },
          proficiency: parsed.proficiency || {},
          unlockedBonds: parsed.unlockedBonds || []
        };
      }
    } catch (e) {
      console.warn("Failed to load pokemon save:", e);
    }
    return defaultData;
  }

  // 保存数据
  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn("Failed to save pokemon data:", e);
    }
  }

  // 计算并更新当前体力
  updateStamina() {
    const now = Date.now();
    if (this.data.stamina >= this.MAX_STAMINA) {
      this.data.stamina = this.MAX_STAMINA;
      this.data.lastRecoverTimestamp = now;
      this.save();
      return this.data.stamina;
    }

    const elapsed = now - (this.data.lastRecoverTimestamp || now);
    const recovered = Math.floor(elapsed / this.RECOVER_INTERVAL);

    if (recovered > 0) {
      const newStamina = Math.min(this.MAX_STAMINA, this.data.stamina + recovered);
      this.data.stamina = newStamina;
      if (newStamina >= this.MAX_STAMINA) {
        this.data.lastRecoverTimestamp = now;
      } else {
        this.data.lastRecoverTimestamp += recovered * this.RECOVER_INTERVAL;
      }
      this.save();
    }

    return this.data.stamina;
  }

  // 获取当前体力值
  getStamina() {
    return this.updateStamina();
  }

  // 消耗体力
  consumeStamina() {
    this.updateStamina();
    if (this.data.stamina > 0) {
      if (this.data.stamina === this.MAX_STAMINA) {
        this.data.lastRecoverTimestamp = Date.now();
      }
      this.data.stamina--;
      this.save();
      return true;
    }
    return false;
  }

  // 获取恢复下一点体力的剩余时间 (毫秒与格式化字符串)
  getTimeToNextStamina() {
    this.updateStamina();
    if (this.data.stamina >= this.MAX_STAMINA) {
      return { ms: 0, text: "体力已满 (5/5)" };
    }

    const now = Date.now();
    const elapsed = now - this.data.lastRecoverTimestamp;
    const remainingMs = Math.max(0, this.RECOVER_INTERVAL - elapsed);

    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, "0");
    return {
      ms: remainingMs,
      text: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    };
  }

  // 获取当前精灵球背包存量
  getPokeBallCounts() {
    if (!this.data.pokeBalls) {
      this.data.pokeBalls = { normal: 0, great: 0, master: 0 };
    }
    const normal = this.data.pokeBalls.normal || 0;
    const great = this.data.pokeBalls.great || 0;
    const master = this.data.pokeBalls.master || 0;
    return {
      normal,
      great,
      master,
      total: normal + great + master
    };
  }

  // 获得精灵球奖励 (每30积分获得1个，按难度分普通/高级/大师)
  addPokeBalls(ballType, count = 1) {
    if (count <= 0) return 0;
    if (!this.data.pokeBalls) {
      this.data.pokeBalls = { normal: 0, great: 0, master: 0 };
    }
    const type = ["normal", "great", "master"].includes(ballType) ? ballType : "normal";
    this.data.pokeBalls[type] = (this.data.pokeBalls[type] || 0) + count;
    this.save();
    return this.data.pokeBalls[type];
  }

  // 消耗 1 个精灵球
  consumePokeBall(ballType) {
    if (!this.data.pokeBalls || !this.data.pokeBalls[ballType] || this.data.pokeBalls[ballType] <= 0) {
      return false;
    }
    this.data.pokeBalls[ballType]--;
    this.save();
    return true;
  }

  // 返还 1 个精灵球 (当捕获 3★ 满星鸟类时触发)
  refundPokeBall(ballType) {
    if (!this.data.pokeBalls) {
      this.data.pokeBalls = { normal: 0, great: 0, master: 0 };
    }
    const type = ["normal", "great", "master"].includes(ballType) ? ballType : "normal";
    this.data.pokeBalls[type] = (this.data.pokeBalls[type] || 0) + 1;
    this.save();
  }

  // 获取精灵球名称与图标
  getBallName(ballType) {
    const map = {
      normal: "普通精灵球 🔴",
      great: "高级球 🔵",
      master: "大师球 🟣"
    };
    return map[ballType] || "精灵球";
  }

  /**
   * 捕获成功：直接将鸟类在宝可梦图鉴中的星级提升 1 星！
   */
  upgradeBirdStarByCapture(bird) {
    const birdName = bird.name;
    if (!this.data.proficiency[birdName]) {
      this.data.proficiency[birdName] = {
        count: 0,
        stars: 0,
        firstDate: Date.now()
      };
    }
    const prof = this.data.proficiency[birdName];
    const oldStars = prof.stars || 0;
    const newStars = Math.min(3, oldStars + 1);
    prof.stars = newStars;
    prof.lastDate = Date.now();

    // 将熟练度次数推进到新星级的基准阈值
    const thresholds = this.getThresholds(bird.orderFamily);
    if (newStars === 1) prof.count = Math.max(prof.count, thresholds.star1);
    else if (newStars === 2) prof.count = Math.max(prof.count, thresholds.star2);
    else if (newStars === 3) prof.count = Math.max(prof.count, thresholds.star3);

    // 增加训练师经验 (每次捕获提升星级 +100 EXP)
    this.data.trainerExp += newStars * 100;
    this.data.trainerLevel = 1 + Math.floor(this.data.trainerExp / 200);

    // 检查羁绊解锁
    let newBondUnlocked = null;
    if (oldStars === 0 && newStars >= 1) {
      newBondUnlocked = this.checkFamilyBond(bird.orderFamily);
    }

    this.save();

    return {
      bird,
      oldStars,
      newStars,
      isLevelUp: newStars > oldStars,
      isMax: newStars === 3,
      newBondUnlocked,
      trainerExp: this.data.trainerExp,
      trainerLevel: this.data.trainerLevel
    };
  }

  /**
   * 使用精灵球尝试捕获鸟类并判定概率
   * 概率设定：普通球 10%, 高级球 20%, 大师球 30% * 稀有系数 K
   */
  attemptCapture(ballType, bird) {
    const status = this.getBirdStatus(bird);

    // 1. 满 3 星保护机制：已达 3★ 满星则不消耗精灵球（直接返还），并提示
    if (status.stars >= 3) {
      return {
        isMaxAlready: true,
        refunded: true,
        success: true,
        ballType,
        bird,
        stars: 3,
        rateInfo: window.calculateCatchRate ? window.calculateCatchRate(ballType, bird) : null,
        message: `✨ 该鸟类图鉴已达到 3★ 满星！直接正确作答，并已为您自动返还【${this.getBallName(ballType)}】！`
      };
    }

    // 2. 检查背包并扣除 1 个精灵球
    const consumed = this.consumePokeBall(ballType);
    if (!consumed) {
      return {
        error: "no_ball",
        message: `背包中【${this.getBallName(ballType)}】数量不足，无法投掷！`
      };
    }

    // 3. 计算捕获概率 P = P_base * K
    const rateInfo = window.calculateCatchRate
      ? window.calculateCatchRate(ballType, bird)
      : { finalRate: 0.1, percentText: "10%" };

    const roll = Math.random();
    const isCaught = roll < rateInfo.finalRate;

    if (isCaught) {
      const upgradeRes = this.upgradeBirdStarByCapture(bird);
      return {
        success: true,
        ballType,
        bird,
        rateInfo,
        oldStars: upgradeRes.oldStars,
        newStars: upgradeRes.newStars,
        isLevelUp: upgradeRes.isLevelUp,
        isMax: upgradeRes.isMax,
        newBondUnlocked: upgradeRes.newBondUnlocked,
        message: `🎉 成功捕获【${bird.name}】！宝可梦图鉴星级直接提升至 ${upgradeRes.newStars}★！`
      };
    } else {
      return {
        success: false,
        ballType,
        bird,
        rateInfo,
        oldStars: status.stars,
        newStars: status.stars,
        message: `💨 精灵球剧烈晃动后未能捕获（实际捕获率: ${rateInfo.percentText}），但已直接识别并正确答对！`
      };
    }
  }

  // 检查某种鸟的科属是否已激活羁绊
  hasBond(orderFamily) {
    if (!orderFamily) return false;
    return this.data.unlockedBonds.includes(orderFamily);
  }

  /**
   * 获取鸟类的星级要求与经验阈值
   * 无羁绊：1星=5次, 2星=15次, 3星=35次 (指数递增)
   * 激活同科羁绊：1星=3次, 2星=9次, 3星=20次 (答对次数大幅减少)
   */
  getThresholds(orderFamily) {
    const isBonded = this.hasBond(orderFamily);
    if (isBonded) {
      return {
        isBonded: true,
        star1: 3,
        star2: 9,
        star3: 20
      };
    }
    return {
      isBonded: false,
      star1: 5,
      star2: 15,
      star3: 35
    };
  }

  // 计算指定鸟类的星级与进度
  getBirdStatus(bird) {
    const prof = this.data.proficiency[bird.name] || { count: 0, stars: 0 };
    const count = prof.count || 0;
    const thresholds = this.getThresholds(bird.orderFamily);

    let stars = 0;
    let nextThreshold = thresholds.star1;
    let prevThreshold = 0;

    if (count >= thresholds.star3) {
      stars = 3;
      nextThreshold = thresholds.star3;
      prevThreshold = thresholds.star2;
    } else if (count >= thresholds.star2) {
      stars = 2;
      nextThreshold = thresholds.star3;
      prevThreshold = thresholds.star2;
    } else if (count >= thresholds.star1) {
      stars = 1;
      nextThreshold = thresholds.star2;
      prevThreshold = thresholds.star1;
    } else {
      stars = 0;
      nextThreshold = thresholds.star1;
      prevThreshold = 0;
    }

    const currentInLevel = Math.max(0, count - prevThreshold);
    const neededInLevel = Math.max(1, nextThreshold - prevThreshold);
    const progressPercent = stars === 3 ? 100 : Math.min(100, Math.round((currentInLevel / neededInLevel) * 100));

    return {
      count,
      stars,
      isBonded: thresholds.isBonded,
      nextThreshold,
      prevThreshold,
      progressPercent,
      isMax: stars === 3
    };
  }

  // 答对一次鸟类：记录熟练度、计算星级提升与羁绊解锁
  recordCorrectAnswer(bird) {
    const birdName = bird.name;
    if (!this.data.proficiency[birdName]) {
      this.data.proficiency[birdName] = {
        count: 0,
        stars: 0,
        firstDate: Date.now()
      };
    }

    const prof = this.data.proficiency[birdName];
    const oldStars = prof.stars || 0;
    prof.count++;
    prof.lastDate = Date.now();

    // 检查新星级
    const status = this.getBirdStatus(bird);
    prof.stars = status.stars;

    const isLevelUp = status.stars > oldStars;
    let newBondUnlocked = null;

    if (isLevelUp) {
      // 增加训练师经验
      this.data.trainerExp += status.stars * 50;
      this.data.trainerLevel = 1 + Math.floor(this.data.trainerExp / 200);

      // 如果刚刚升到 1 星以上，检查是否触发同目同科羁绊
      if (oldStars === 0 && status.stars >= 1) {
        newBondUnlocked = this.checkFamilyBond(bird.orderFamily);
      }
    }

    this.save();

    return {
      count: prof.count,
      oldStars,
      newStars: status.stars,
      isLevelUp,
      newBondUnlocked,
      trainerExp: this.data.trainerExp,
      trainerLevel: this.data.trainerLevel
    };
  }

  // 检查指定科属是否达成 5 张 1 星卡激活羁绊
  checkFamilyBond(orderFamily) {
    if (!orderFamily || this.hasBond(orderFamily)) return null;

    const allBirds = Array.isArray(BIRDS_500_DATA) ? BIRDS_500_DATA : [];
    const familyBirds = allBirds.filter((b) => b.orderFamily === orderFamily);

    let star1Count = 0;
    familyBirds.forEach((b) => {
      const p = this.data.proficiency[b.name];
      if (p && p.stars >= 1) {
        star1Count++;
      }
    });

    if (star1Count >= this.BOND_THRESHOLD) {
      this.data.unlockedBonds.push(orderFamily);
      this.save();
      return {
        orderFamily,
        star1Count,
        totalFamily: familyBirds.length
      };
    }

    return null;
  }

  // 获取所有科属的羁绊进展概览
  getAllFamilyBondsProgress() {
    const allBirds = Array.isArray(BIRDS_500_DATA) ? BIRDS_500_DATA : [];
    const familiesMap = {};

    allBirds.forEach((b) => {
      const fam = b.orderFamily || "其他目 · 其他科";
      if (!familiesMap[fam]) {
        familiesMap[fam] = {
          name: fam,
          birds: [],
          star1Count: 0,
          isUnlocked: this.hasBond(fam)
        };
      }
      familiesMap[fam].birds.push(b);
      const p = this.data.proficiency[b.name];
      if (p && p.stars >= 1) {
        familiesMap[fam].star1Count++;
      }
    });

    const result = Object.values(familiesMap);
    // 按已激活 > 接近激活 > 鸟类总数 排序
    result.sort((a, b) => {
      if (a.isUnlocked !== b.isUnlocked) return a.isUnlocked ? -1 : 1;
      if (b.star1Count !== a.star1Count) return b.star1Count - a.star1Count;
      return b.birds.length - a.birds.length;
    });

    return result;
  }

  // 获取训练师统计汇总
  getStatsSummary() {
    const allBirds = Array.isArray(BIRDS_500_DATA) ? BIRDS_500_DATA : [];
    let star0 = 0;
    let star1 = 0;
    let star2 = 0;
    let star3 = 0;

    allBirds.forEach((b) => {
      const p = this.data.proficiency[b.name];
      const s = p ? p.stars || 0 : 0;
      if (s === 3) star3++;
      else if (s === 2) star2++;
      else if (s === 1) star1++;
      else star0++;
    });

    const totalCollected = star1 + star2 + star3;
    const totalBonds = this.data.unlockedBonds.length;

    return {
      totalBirds: allBirds.length,
      totalCollected,
      star1,
      star2,
      star3,
      star0,
      totalBonds,
      trainerLevel: this.data.trainerLevel,
      trainerExp: this.data.trainerExp,
      stamina: this.getStamina(),
      pokeBalls: this.getPokeBallCounts()
    };
  }
}

// 挂载全局单例
window.birdPokemonSystem = new BirdPokemonSystem();
