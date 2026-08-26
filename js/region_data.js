/**
 * 中国鸟类地理区域与难度分级核心系统 (Region & Difficulty System)
 * 包含：7大地理大区、34个国内省级行政区映射、常见度分级 (简单前20% / 普通前50% / 困难全部)
 */

const CHINA_REGIONS = [
  { id: "all", name: "全国分布", icon: "🇨🇳", provinces: ["全国"] },
  { id: "north", name: "华北地区", icon: "🏛️", provinces: ["北京", "天津", "河北", "山西", "内蒙古"] },
  { id: "northeast", name: "东北地区", icon: "🌲", provinces: ["辽宁", "吉林", "黑龙江"] },
  { id: "east", name: "华东地区", icon: "🌊", provinces: ["上海", "江苏", "浙江", "安徽", "福建", "江西", "山东"] },
  { id: "central", name: "华中地区", icon: "🌾", provinces: ["河南", "湖北", "湖南"] },
  { id: "south", name: "华南地区", icon: "🌴", provinces: ["广东", "广西", "海南", "香港", "澳门", "台湾"] },
  { id: "southwest", name: "西南地区", icon: "⛰️", provinces: ["重庆", "四川", "贵州", "云南", "西藏"] },
  { id: "northwest", name: "西北地区", icon: "🏜️", provinces: ["陕西", "甘肃", "青海", "宁夏", "新疆"] }
];

const ALL_PROVINCES = [
  "北京", "天津", "河北", "山西", "内蒙古",
  "辽宁", "吉林", "黑龙江",
  "上海", "江苏", "浙江", "安徽", "福建", "江西", "山东",
  "河南", "湖北", "湖南",
  "广东", "广西", "海南", "香港", "澳门", "台湾",
  "重庆", "四川", "贵州", "云南", "西藏",
  "陕西", "甘肃", "青海", "宁夏", "新疆"
];

// 省份到大区的快速反向映射
const PROVINCE_TO_REGION = {};
CHINA_REGIONS.forEach((r) => {
  if (r.id !== "all") {
    r.provinces.forEach((p) => {
      PROVINCE_TO_REGION[p] = r.id;
    });
  }
});

// 简单 (Easy): 前 20% 最常见中国野生鸟类 (约 100 种)
const TOP_20_EASY_BIRDS = [
  "树麻雀", "家麻雀", "喜鹊", "珠颈斑鸠", "白头鹎", "乌鸫", "大山雀", "红嘴蓝鹊", "灰喜鹊", "戴胜", "家燕", "金腰燕",
  "金翅雀", "黄雀", "燕雀", "黑尾蜡嘴雀", "黑头蜡嘴雀", "黄胸鵐", "黑脸鵐", "黄喉鵐", "灰头鵐", "三道眉草鵐",
  "白鹡鸰", "灰鹡鸰", "黄鹡鸰", "树鹨", "理氏鹨", "云雀", "小云雀", "凤头百灵", "红嘴山鸦", "达乌里寒鸦",
  "大嘴乌鸦", "小嘴乌鸦", "松鸦", "红耳鹎", "白喉红臀鹎", "黑短脚鹎", "领雀嘴鹎", "栗耳短脚鹎", "红头长尾山雀", "银喉长尾山雀",
  "黄腹山雀", "沼泽山雀", "煤山雀", "白脸山雀", "暗绿绣眼鸟", "红胁绣眼鸟", "棕头鸦雀", "纯色噪鹛", "白颊噪鹛", "画眉",
  "红嘴相思鸟", "黑卷尾", "灰卷尾", "发冠卷尾", "寿带", "灰山椒鸟", "黑枕黄鹂", "八哥", "丝光椋鸟", "灰椋鸟",
  "黑领椋鸟", "普通翠鸟", "蓝翡翠", "白胸翡翠", "大斑啄木鸟", "灰头绿啄木鸟", "斑姬啄木鸟", "普通夜鹰", "斑头鸺鹠", "领角鸮",
  "红隼", "普通鵟", "黑鸢", "雀鹰", "环颈雉", "红腹锦鸡", "山斑鸠", "火斑鸠", "白胸苦恶鸟", "黑水鸡",
  "小䴙䴘", "凤头䴙䴘", "绿头鸭", "斑嘴鸭", "针尾鸭", "赤颈鸭", "绿翅鸭", "琵嘴鸭", "凤头潜鸭", "鸳鸯",
  "苍鹭", "白鹭", "中白鹭", "夜鹭", "池鹭", "牛背鹭", "红嘴鸥", "普通燕鸥", "凤头麦鸡", "金眶鸻"
];

// 普通 (Normal): 前 50% 常见中国野生鸟类 (前 101~250 种)
const TOP_50_NORMAL_BIRDS = [
  "普通朱雀", "酒红朱雀", "长尾雀", "粉红胸朱雀", "栗鵐", "白眉鵐", "田鹀", "小鹀", "苇鵐", "白头鵐",
  "水鹨", "粉红胸鹨", "红喉鹨", "林鹨", "蒙古百灵", "短趾百灵", "角百灵", "渡鸦", "白颈鸦", "秃鼻乌鸦",
  "星鸦", "灰树鹊", "长尾缝叶莺", "褐柳莺", "黄腰柳莺", "黄眉柳莺", "极北柳莺", "巨嘴柳莺", "强脚树莺", "远东苇莺",
  "东方大苇莺", "黑眉苇莺", "纯色山鹪莺", "灰头鹪莺", "暗绿柳莺", "冠纹柳莺", "栗头鹟莺", "金眶鹟莺", "棕噪鹛", "黑喉噪鹛",
  "黑领噪鹛", "银耳相思鸟", "红翅薮鹛", "金额雀鹛", "灰眶雀鹛", "火尾太阳鸟", "黄腹太阳鸟", "叉尾太阳鸟", "蓝喉太阳鸟", "黑胸太阳鸟",
  "红尾水鸲", "北红尾鸲", "红胁蓝尾鸲", "蓝额红尾鸲", "白顶溪鸲", "蓝喉歌鸲", "红喉歌鸲", "蓝歌鸲", "蓝矶鸫", "紫啸鸫",
  "橙胸姬鹟", "白腹姬鹟", "铜蓝鹟", "灰纹鹟", "北灰鹟", "乌鹟", "白眉姬鹟", "黄眉姬鹟", "鸲姬鹟", "灰背鸫",
  "乌灰鸫", "白眉鸫", "白腹鸫", "赤颈鸫", "红尾鸫", "斑鸫", "怀氏虎斑地鸫", "宝兴歌鸫", "黑尾地鸦", "太平鸟",
  "小太平鸟", "游隼", "苍鹰", "红脚隼", "黄爪隼", "纵纹腹小鸮", "长耳鸮", "短耳鸮", "灰林鸮", "普通楼燕",
  "小白腰雨燕", "白腰雨燕", "岩燕", "崖沙燕", "大杜鹃", "中杜鹃", "小杜鹃", "四声杜鹃", "鹰鹃", "噪鹃",
  "乌鹃", "八色鸫", "小鸦鹃", "褐翅鸦鹃", "绿嘴地鹃", "红翅凤头鹃", "大拟啄木鸟", "蓝喉拟啄木鸟", "斑头大拟啄木鸟", "栗喉蜂虎",
  "蓝喉蜂虎", "冠鱼狗", "白腹黑啄木鸟", "黑啄木鸟", "白背啄木鸟", "三趾啄木鸟", "黑冠鳽", "黄苇鳽", "紫鹭", "大白鹭",
  "白琵鹭", "黑脸琵鹭", "东方白鹳", "黑鹳", "大天鹅", "小天鹅", "鸿雁", "豆雁", "灰雁", "斑头雁",
  "赤麻鸭", "翘鼻麻鸭", "花脸鸭", "罗纹鸭", "赤嘴潜鸭", "红头潜鸭", "青头潜鸭", "中华秋沙鸭", "普通秋沙鸭", "红胸秋沙鸭",
  "灰胸竹鸡", "石鸡", "斑翅山鹑", "白鹇", "白腹锦鸡", "勺鸡", "血雉", "董鸡", "骨顶鸡", "水雉"
];

/**
 * 根据栖息生境、科属特征及物种名称推断鸟类地理大区与省级分布
 */
function inferBirdRegionsAndProvinces(bird) {
  const name = bird.name || "";
  const habitat = bird.habitat || "";
  const cat = bird.category || "";

  // 1. 青藏高原与西北高海拔荒漠专属物种
  if (
    /西藏|藏|高原|雪线|青藏|高山杜鹃|喜马拉雅/.test(habitat) ||
    /藏|雪雀|雪鸡|虹雉|马鸡|角雉|地山雀|白斑翅雪雀|红颈雪雀|白腰雪雀|黑喉雪雀/.test(name)
  ) {
    return {
      regions: ["southwest", "northwest"],
      provinces: ["西藏", "青海", "四川", "云南", "甘肃", "新疆"]
    };
  }

  // 2. 华南、海南与台湾热带特有/特色物种
  if (
    /华南|海南|台湾|热带雨林|季雨林/.test(habitat) ||
    /台湾|海南|长尾缝叶|白耳画眉|冠羽画眉|金翼白眉|帝雉|蓝腹鹇|八色鸫|犀鸟|双角犀鸟|咬鹃|太阳鸟|红耳鹎|白喉红臀鹎|栗喉蜂虎/.test(name)
  ) {
    return {
      regions: ["south", "southwest", "east"],
      provinces: ["广东", "广西", "海南", "香港", "澳门", "台湾", "云南", "福建", "贵州"]
    };
  }

  // 3. 东北针阔叶林、寒温带及北方特有物种
  if (
    /落叶松|针叶林|苔原|北方|天山|阿尔泰/.test(habitat) ||
    /雷鸟|松鸡|榛鸡|北朱雀|长尾雀|红腹灰雀|松雀|三趾啄木鸟|黑百灵|蒙古百灵|雪鹀|铁爪鹀|苍头燕雀|灰蓝山雀|中华秋沙鸭|丹顶鹤/.test(name)
  ) {
    return {
      regions: ["northeast", "north", "northwest"],
      provinces: ["黑龙江", "吉林", "辽宁", "内蒙古", "新疆", "河北", "山西", "北京"]
    };
  }

  // 4. 西南横断山脉、丘陵林鸟
  if (
    /西南|横断|竹林|次生林/.test(habitat) ||
    /噪鹛|相思鸟|薮鹛|雀鹛|锦鸡|四川山鹧鸪|白鹇|朱雀|灰头灰雀|橙胸姬鹟|铜蓝鹟/.test(name)
  ) {
    return {
      regions: ["southwest", "central", "south", "northwest"],
      provinces: ["四川", "云南", "贵州", "重庆", "西藏", "陕西", "甘肃", "湖北", "湖南", "广西"]
    };
  }

  // 5. 水鸟/湿地/沿海滩涂
  if (cat === "游禽" || cat === "涉禽" || /水|湿地|湖|河|海|滩|沼泽|库/.test(habitat)) {
    return {
      regions: ["all", "east", "south", "central", "north", "northeast", "southwest", "northwest"],
      provinces: ["全国", "江苏", "浙江", "上海", "山东", "广东", "江西", "湖北", "湖南", "安徽", "辽宁", "黑龙江", "云南", "青海", "内蒙古", "福建", "河北", "天津", "北京", "四川"]
    };
  }

  // 6. 全国广泛分布物种 (城市、旷野、农田、常见鸣禽/攀禽/陆禽)
  return {
    regions: ["all", "north", "northeast", "east", "central", "south", "southwest", "northwest"],
    provinces: ["全国", ...ALL_PROVINCES]
  };
}

/**
 * 初始化并丰富 500 种鸟类数据库
 */
function enrichAllBirdsData() {
  const birds = Array.isArray(window.BIRDS_500_DATA) ? window.BIRDS_500_DATA : (typeof BIRDS_500_DATA !== "undefined" ? BIRDS_500_DATA : []);
  if (!birds || birds.length === 0) return;

  const total = birds.length;
  const easyCount = Math.ceil(total * 0.20); // 前 20% = 100 种
  const normalCount = Math.ceil(total * 0.50); // 前 50% = 250 种

  birds.forEach((bird, idx) => {
    // 1. 区域与省份推断
    const geo = inferBirdRegionsAndProvinces(bird);
    bird.regions = geo.regions;
    bird.provinces = geo.provinces;

    // 2. 常见度打分
    if (TOP_20_EASY_BIRDS.includes(bird.name)) {
      bird.commonTier = "easy";
      bird.commonRank = TOP_20_EASY_BIRDS.indexOf(bird.name) + 1;
    } else if (TOP_50_NORMAL_BIRDS.includes(bird.name)) {
      bird.commonTier = "normal";
      bird.commonRank = easyCount + TOP_50_NORMAL_BIRDS.indexOf(bird.name) + 1;
    } else {
      bird.commonTier = "hard";
      bird.commonRank = normalCount + idx + 1;
    }
  });

  // 按常见度升序排列，并精确重赋予 1 ~ N 排名、Tier 与科学懂鸟稀有指数 (1.0 ~ 9.8)
  birds.sort((a, b) => a.commonRank - b.commonRank);
  birds.forEach((bird, idx) => {
    bird.commonRank = idx + 1;
    if (idx < easyCount) {
      bird.commonTier = "easy";
      // 简单前 20% (1-100 种): 稀有指数 1.2 ~ 4.8 (系数 1.0)
      bird.rarityIndex = parseFloat((1.2 + (idx / easyCount) * 3.6).toFixed(1));
    } else if (idx < normalCount) {
      bird.commonTier = "normal";
      // 普通前 50% (101-250 种): 稀有指数 5.0 ~ 6.9 (系数 0.7)
      const normalOffset = idx - easyCount;
      const normalSpan = normalCount - easyCount;
      bird.rarityIndex = parseFloat((5.0 + (normalOffset / normalSpan) * 1.9).toFixed(1));
    } else {
      bird.commonTier = "hard";
      const hardOffset = idx - normalCount;
      const hardSpan = total - normalCount;
      // 困难 (251-500 种): 细分为 7.0~7.9 (50%), 8.0~8.9 (35%), 9.0~9.8 (15%)
      if (hardOffset < hardSpan * 0.50) {
        bird.rarityIndex = parseFloat((7.0 + (hardOffset / (hardSpan * 0.50)) * 0.9).toFixed(1));
      } else if (hardOffset < hardSpan * 0.85) {
        const span2 = hardSpan * 0.35;
        const off2 = hardOffset - hardSpan * 0.50;
        bird.rarityIndex = parseFloat((8.0 + (off2 / span2) * 0.9).toFixed(1));
      } else {
        const span3 = hardSpan * 0.15;
        const off3 = hardOffset - hardSpan * 0.85;
        bird.rarityIndex = parseFloat((9.0 + (off3 / span3) * 0.8).toFixed(1));
      }
    }

    // 重点特有及国家极危珍禽保底高稀有指数 (>= 9.0)
    const CRITICAL_RARE_NAMES = [
      "中华凤头燕鸥", "勺嘴鹬", "黑脸琵鹭", "中华秋沙鸭", "海南鳽", "白鹤", "青头潜鸭", "绿孔雀",
      "白颈长尾雉", "黄腹角雉", "朱鹮", "东方白鹳", "黑鹳", "丹顶鹤", "白头鹤", "黑颈鹤", "大鸨",
      "白肩雕", "玉带海雕", "白尾海雕", "虎头海雕", "金雕", "胡兀鹫", "绿尾虹雉", "白马鸡", "红腹角雉"
    ];
    if (CRITICAL_RARE_NAMES.includes(bird.name)) {
      bird.rarityIndex = Math.max(bird.rarityIndex, 9.2);
    }
  });

  console.log(`[RegionData] 成功为 ${birds.length} 种鸟类注入难度分级、懂鸟稀有指数与中国省级分布数据！(简单: 1-${easyCount}, 普通: 1-${normalCount}, 困难: 1-${total})`);
}

/**
 * 获取鸟类的懂鸟稀有指数 (1.0 ~ 9.8)
 */
function getBirdRarityIndex(bird) {
  if (!bird) return 5.0;
  if (typeof bird.rarityIndex === "number") return bird.rarityIndex;
  return 5.0;
}

/**
 * 根据懂鸟稀有指数获取捕获概率系数 K:
 * R < 5: K = 1.0
 * 5 <= R < 7: K = 0.7
 * 7 <= R < 8: K = 0.5
 * 8 <= R < 9: K = 0.3
 * R >= 9: K = 0.2
 */
function getRarityCoefficient(rarityIndex) {
  const r = typeof rarityIndex === "number" ? rarityIndex : 5.0;
  if (r < 5.0) return 1.0;
  if (r < 7.0) return 0.7;
  if (r < 8.0) return 0.5;
  if (r < 9.0) return 0.3;
  return 0.2;
}

/**
 * 计算三种精灵球对目标鸟类的捕获概率
 * 普通球 base = 0.10, 高级球 base = 0.20, 大师球 base = 0.30
 */
function calculateCatchRate(ballType, bird) {
  const baseRates = {
    normal: 0.10,
    great: 0.20,
    master: 0.30
  };
  const base = baseRates[ballType] || 0.10;
  const rarity = getBirdRarityIndex(bird);
  const k = getRarityCoefficient(rarity);
  const finalRate = base * k;
  const percentText = `${Math.round(finalRate * 100)}%`;

  return {
    ballType,
    baseRate: base,
    rarityIndex: rarity,
    coefficient: k,
    finalRate,
    percentText
  };
}

// 导出全局对象
window.CHINA_REGIONS = CHINA_REGIONS;
window.ALL_PROVINCES = ALL_PROVINCES;
window.PROVINCE_TO_REGION = PROVINCE_TO_REGION;
window.enrichAllBirdsData = enrichAllBirdsData;
window.getBirdRarityIndex = getBirdRarityIndex;
window.getRarityCoefficient = getRarityCoefficient;
window.calculateCatchRate = calculateCatchRate;

// 自动执行一次富化
if (typeof BIRDS_500_DATA !== "undefined") {
  enrichAllBirdsData();
}
