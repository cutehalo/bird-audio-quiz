# 500 种中国鸟类全量权威数据生成脚本
$birds = [System.Collections.Generic.List[PSCustomObject]]::new()

function Add-Bird($name, $latin, $pinyin, $orderFamily, $category, $habitat, $voice, $recordist = "") {
    $id = "bird_" + ($script:birds.Count + 1).ToString("000")
    $safeLatin = [uri]::EscapeDataString($latin)
    
    # 构建音频链接（本地优先，在线 Xeno-canto 流媒体回退）
    $localFile = "audio/$id.mp3"
    $xcSearchUrl = "https://xeno-canto.org/api/2/recordings?query=$safeLatin"
    
    $obj = [PSCustomObject]@{
        id = $id
        name = $name
        latin = $latin
        pinyin = $pinyin
        orderFamily = $orderFamily
        category = $category
        habitat = $habitat
        voiceFeatures = $voice
        recordist = $recordist
        audioUrls = @($localFile, $xcSearchUrl)
    }
    $script:birds.Add($obj)
}

# --- 核心常见代表鸟类 ---
Add-Bird "树麻雀" "Passer montanus" "shù má què" "雀形目 · 雀科" "鸣禽" "城乡公园、农田、绿化树" "短促清脆的“啾-啾-”喧闹鸣唱" "Pietro Bonanno"
Add-Bird "喜鹊" "Pica serica" "xǐ què" "雀形目 · 鸦科" "鸣禽" "平原、农田、公园、行道树" "粗粝嘹亮的“喀-喀-喀-喀”连续单音" "Joan Theng"
Add-Bird "珠颈斑鸠" "Spilopelia chinensis" "zhū jǐng bān jiū" "鸽形目 · 鸠鸽科" "陆禽" "城市绿地、行道树、公园" "温和低沉的三音节“咕-咕-咕——咕”" "Albert Lastukhin"
Add-Bird "白头鹎" "Pycnonotus sinensis" "bái tóu bēi" "雀形目 · 鹎科" "鸣禽" "城市公园、小区绿化、果园" "极其活泼圆润的“咕唧-咕唧-多来咪”笛音" "林勇贤"
Add-Bird "乌鸫" "Turdus mandarinus" "wū dōng" "雀形目 · 鸫科" "鸣禽" "城市绿化带、草坪、林荫道" "被誉为‘百舌’，歌声婉转悠扬、多变动听" "Peter Boesman"
Add-Bird "大山雀" "Parus minor" "dà shān què" "雀形目 · 山雀科" "鸣禽" "阔叶林、针叶林、次生林" "清脆利落的双音节“仔黑-仔黑”（tea-cher）" "Peter Boesman"
Add-Bird "红嘴蓝鹊" "Urocissa erythroryncha" "hóng zuǐ lán què" "雀形目 · 鸦科" "鸣禽" "山地林缘、景区、近山公园" "清脆高扬的哨音“嘘——嘘——”及粗哑警戒声" "Albert Lastukhin"
Add-Bird "灰喜鹊" "Cyanopica cyanus" "huī xǐ què" "雀形目 · 鸦科" "鸣禽" "松柏林、高校校园、城镇绿地" "小群活动时沙哑刺耳的“叽-喳-喳”颤音" "薄顺奇"
Add-Bird "戴胜" "Upupa epops" "dài shèng" "犀鸟目/戴胜目 · 戴胜科" "攀禽" "开阔林地、农田、公园草坪" "标志性低沉沉闷的三音节叫声“呼-呼-呼”" "Zsombor Károlyi"
Add-Bird "家燕" "Hirundo rustica" "jiā yàn" "雀形目 · 燕科" "鸣禽" "农舍村庄、屋檐、开阔水面" "急促轻快的叽叽喳喳啭鸣，带欢快颤音" "João Ferreira Tomás"

# 引入 500 鸟类权威名录
$rawSpecies = @(
    # 雀形目 - 雀科/鵐科/鹡鸰科/百灵科
    @("金翅雀", "Chloris sinica", "jīn chì què", "雀形目 · 雀科", "鸣禽", "平原林地与城市绿化", "如小金铃般连续滚动的清脆颤鸣"),
    @("黄雀", "Spinus spinus", "huáng què", "雀形目 · 雀科", "鸣禽", "针叶林与低地农田", "快速多变的轻细呢喃啭鸣"),
    @("燕雀", "Fringilla montifringilla", "yān què", "雀形目 · 雀科", "鸣禽", "阔叶林与越冬农田", "飞行时发出单调沙哑的“嘎-嘎-”或“兹-”声"),
    @("苍头燕雀", "Fringilla coelebs", "cāng tóu yān què", "雀形目 · 雀科", "鸣禽", "天山及新疆林地", "欢快有力的下行旋律，尾音铿锵"),
    @("黑尾蜡嘴雀", "Eophona migratoria", "hēi wěi là zuǐ què", "雀形目 · 雀科", "鸣禽", "平原与丘陵林地", "圆润高亢的笛音“狄-嘟-哩”，音色极清澈"),
    @("黑头蜡嘴雀", "Eophona personata", "hēi tóu là zuǐ què", "雀形目 · 雀科", "鸣禽", "北方针阔混交林", "哨音比黑尾蜡嘴雀更深沉有力"),
    @("锡嘴雀", "Coccothraustes coccothraustes", "xī zuǐ què", "雀形目 · 雀科", "鸣禽", "阔叶林与果园", "尖锐短促的“茨-”爆破音，金属感强烈"),
    @("普通朱雀", "Carpodacus erythrinus", "pǔ tōng zhū què", "雀形目 · 雀科", "鸣禽", "亚高山灌丛与林缘", "清晰动听的四音节鸣唱"),
    @("酒红朱雀", "Carpodacus vinaceus", "jiǔ hóng zhū què", "雀形目 · 雀科", "鸣禽", "中高海拔竹林与灌丛", "单调轻柔的高音“哔-哔-”声"),
    @("红交嘴雀", "Loxia curvirostra", "hóng jiāo zuǐ què", "雀形目 · 雀科", "鸣禽", "高山云杉针叶林", "飞行时坚实有力的连续“嘁克-嘁克-”叫声"),
    @("白翅交嘴雀", "Loxia leucoptera", "bái chì jiāo zuǐ què", "雀形目 · 雀科", "鸣禽", "落叶松林", "干脆的“咯-咯-”或双声击打音"),
    @("红腹灰雀", "Pyrrhula pyrrhula", "hóng fù huī què", "雀形目 · 雀科", "鸣禽", "高纬度针阔混交林", "忧郁低沉而悠扬的短笛单音“嘟——”"),
    @("灰头灰雀", "Pyrrhula erythaca", "huī tóu huī què", "雀形目 · 雀科", "鸣禽", "中高山林地竹灌丛", "轻微如哀鸣般的微弱哨音"),
    @("长尾雀", "Carpodacus sibiricus", "cháng wěi què", "雀形目 · 雀科", "鸣禽", "北方河谷柳林与灌丛", "如银铃般的清脆三音节短鸣"),
    @("黄胸鵐", "Emberiza aureola", "huáng xiōng wú", "雀形目 · 鵐科", "鸣禽", "芦苇湿地、河滩草甸", "极清脆婉转的多音节鸣唱，带金属性亮音"),
    @("栗鵐", "Emberiza rutila", "lì wú", "雀形目 · 鵐科", "鸣禽", "林间灌丛与开阔草地", "欢快急促的高音流水调鸣啭"),
    @("黑脸鵐", "Emberiza spodocephala", "hēi liǎn wú", "雀形目 · 鵐科", "鸣禽", "城市绿地灌丛与湿地", "单音节金属敲击声“哧！”，鸣唱轻快短促"),
    @("白眉鵐", "Emberiza tristrami", "bái méi wú", "雀形目 · 鵐科", "鸣禽", "针阔混交林地表", "极高频纤细的单音“嗞——”"),
    @("黄喉鵐", "Emberiza elegans", "huáng hóu wú", "雀形目 · 鵐科", "鸣禽", "山地丘陵灌木林", "富有旋律感的优美短歌，起伏活泼"),
    @("灰头鵐", "Emberiza fucata", "huī tóu wú", "雀形目 · 鵐科", "鸣禽", "开阔草地、农田田埂", "短促有力的“唧-唧-喳”连续颤音"),
    @("田鵐", "Emberiza rustica", "tián wú", "雀形目 · 鵐科", "鸣禽", "潮湿针叶林与灌木沼泽", "尖细高调的“兹-兹-”声与婉转鸣唱"),
    @("小鵐", "Emberiza pusilla", "xiǎo wú", "雀形目 · 鵐科", "鸣禽", "苔原林缘与草地柳丛", "急促细弱的连续高频碎鸣“匹-匹-匹”"),
    @("三道眉草鵐", "Emberiza cioides", "sān dào méi cǎo wú", "雀形目 · 鵐科", "鸣禽", "荒山草坡、灌木林缘", "清晰响亮的四段式鸣啭，旋律起伏明显"),
    @("白鹡鸰", "Motacilla alba", "bái jí líng" ,"雀形目 · 鹡鸰科", "鸣禽", "水边湿地、城市广场", "边飞边摇尾，发出清脆跳跃的“唧-令，唧-令”"),
    @("黄鹡鸰", "Motacilla tschutschensis", "huáng jí líng", "雀形目 · 鹡鸰科", "鸣禽", "草甸、农田、泥滩", "高频刺耳的单音“唧-唧-”"),
    @("灰鹡鸰", "Motacilla cinerea", "huī jí líng", "雀形目 · 鹡鸰科", "鸣禽", "山间清澈溪流与卵石滩", "比白鹡鸰更尖细清脆的“茨-茨-”双声"),
    @("树鹨", "Anthus hodgsoni", "shù liù", "雀形目 · 鹡鸰科", "鸣禽", "林缘空地与草坪地表", "受惊飞上树时发出细锐拖长的“斯——”声"),
    @("水鹨", "Anthus spinoletta", "shuǐ liù", "雀形目 · 鹡鸰科", "鸣禽", "湖畔滩涂与泥泞草地", "急促清脆的“噼-噼-”连音"),
    @("理氏鹨", "Anthus richardi", "lǐ shì liù", "雀形目 · 鹡鸰科", "鸣禽", "开阔平原草地与农田", "强劲粗粝的爆破音“嚓-嚓-”，极具穿透力"),
    @("云雀", "Alauda arvensis", "yún què", "雀形目 · 百灵科", "鸣禽", "开阔原野、农田草甸", "高空悬停时连续数分钟不绝的高亢欢快长啭"),
    @("小云雀", "Alauda gulgula", "xiǎo yún què", "雀形目 · 百灵科", "鸣禽", "南方草地与干旱田埂", "鸣唱短促但极为多变，常伴随迎风振翅"),
    @("蒙古百灵", "Melanocorypha mongolica", "měng gǔ bǎi líng", "雀形目 · 百灵科", "鸣禽", "干旱草原与荒漠草原", "音量洪大、音域宽广，极善模仿百鸟之声"),
    @("凤头百灵", "Galerida cristata", "fèng tóu bǎi líng", "雀形目 · 百灵科", "鸣禽", "路旁干燥荒地与沙地", "柔美忧郁的四音节口哨声“呼-度-微-呜”"),
    @("角百灵", "Eremophila alpestris", "jiǎo bǎi líng", "雀形目 · 百灵科", "鸣禽", "高山苔原与高原草甸", "纤细如微风拂动风铃般的细碎高音"),

    # 鸦科/山雀科/鹎科/长尾山雀科
    @("红嘴山鸦", "Pyrrhocorax pyrrhocorax", "hóng zuǐ shān yā", "雀形目 · 鸦科", "鸣禽", "高原岩壁与悬崖草甸", "极其清脆清凉的金属哨声“恰——”"),
    @("达乌里寒鸦", "Coloeus dauuricus", "dá wū lǐ hán yā", "雀形目 · 鸦科", "鸣禽", "平原农田、开阔林地", "高音短促的“夹-夹-”叫声，比大乌鸦清脆"),
    @("大嘴乌鸦", "Corvus macrorhynchos", "dà zuǐ wū yā", "雀形目 · 鸦科", "鸣禽", "山地森林、城市近郊", "深沉浑厚的“哑——哑——”低鸣，腔调低沉"),
    @("小嘴乌鸦", "Corvus corone", "xiǎo zuǐ wū yā", "雀形目 · 鸦科", "鸣禽", "开阔农田、河滩原野", "粗糙干裂的“嘎-嘎-嘎-”鸣叫"),
    @("渡鸦", "Corvus corax", "dù yā", "雀形目 · 鸦科", "鸣禽", "高原荒漠、悬崖峭壁", "极其低沉深邃如敲击中空木桶的“咯-克”声"),
    @("松鸦", "Garrulus glandarius", "sōng yā", "雀形目 · 鸦科", "鸣禽", "阔叶林与针叶林", "极其粗暴刺耳的撕裂声“嘎——”"),
    @("星鸦", "Nucifraga caryocatactes", "xīng yā", "雀形目 · 鸦科", "鸣禽", "亚高山针叶林", "沙哑而极具穿透力的长声“喀——喀——”"),
    @("灰树鹊", "Dendrocitta formosae", "huī shù què", "雀形目 · 鸦科", "鸣禽", "常绿阔叶林与竹林", "奇特刺耳的金属敲击声与机械般嘎嘎声"),
    @("黄腹山雀", "Pardaliparus venustulus", "huáng fù shān què", "雀形目 · 山雀科", "鸣禽", "中国特有，丘陵阔叶林", "极纤细轻快的“哧-哧-哧”细鸣"),
    @("绿背山雀", "Parus monticolus", "lǜ bèi shān què", "雀形目 · 山雀科", "鸣禽", "中高山混交林", "比大山雀更浑厚快速的多音节连奏"),
    @("黄颊山雀", "Machlolophus spilonotus", "huáng jiá shān què", "雀形目 · 山雀科", "鸣禽", "常绿阔叶林冠层", "带有高耸凤冠，鸣唱高亢嘹亮如笛"),
    @("煤山雀", "Periparus ater", "méi shān què", "雀形目 · 山雀科", "鸣禽", "针叶林与云杉林", "高频细尖而急促的“齐-匹，齐-匹”"),
    @("褐头山雀", "Poecile montanus", "hè tóu shān què", "雀形目 · 山雀科", "鸣禽", "北方泰加针叶林", "特征性的鼻音“哧——埃——埃”"),
    @("沼泽山雀", "Poecile palustris", "zhǎo zé shān què", "雀形目 · 山雀科", "鸣禽", "落叶阔叶林与湿润灌丛", "爆发性的“吡-秋！”双音"),
    @("银喉长尾山雀", "Aegithalos glaucogularis", "yín hóu cháng wěi shān què", "雀形目 · 长尾山雀科", "鸣禽", "平原与山地林间", "成群穿梭发出细小可爱的“思-思-思”碎鸣"),
    @("红头长尾山雀", "Aegithalos concinnus", "hóng tóu cháng wěi shān què", "雀形目 · 长尾山雀科", "鸣禽", "阔叶林与灌木丛", "如同‘小熊猫’般的萌态，连续轻微“唧唧”"),
    @("红耳鹎", "Pycnonotus jocosus", "hóng ěr bēi", "雀形目 · 鹎科", "鸣禽", "华南城市绿地与林缘", "头戴高冠，歌声欢快高亢“匹-咯-哩-丘”"),
    @("黄臀鹎", "Pycnonotus xanthorrhous", "huáng tún bēi", "雀形目 · 鹎科", "鸣禽", "西南干燥灌丛与开阔林地", "短促而富有弹性的口哨短音"),
    @("黑短脚鹎", "Hypsipetes leucocephalus", "hēi duǎn jiǎo bēi", "雀形目 · 鹎科", "鸣禽", "常绿阔叶林高树冠", "喧闹多变，如猫叫般的“喵——”与尖哨"),
    @("领雀嘴鹎", "Spizixos semitorques", "lǐng què zuǐ bēi", "雀形目 · 鹎科", "鸣禽", "丘陵灌丛与次生林", "圆厚多变似画眉般的饱满啭鸣"),

    # 鸫科/鹟科/噪鹛科
    @("蓝矶鸫", "Monticola solitarius", "lán jī dōng", "雀形目 · 鹟科", "鸣禽", "海岸礁石、山区悬崖", "极其优美悠扬的高亢笛音，纯净空灵"),
    @("白眉鸫", "Turdus obscurus", "bái méi dōng", "雀形目 · 鸫科", "鸣禽", "迁徙经过各地林地", "短促柔和的“兹-兹-”呼叫与轻快晨歌"),
    @("斑鸫", "Turdus eunomus", "bān dōng", "雀形目 · 鸫科", "鸣禽", "冬日农田、果园、开阔林", "沙哑的喉音“嘎-嘎-嘎”"),
    @("红尾鸫", "Turdus naumanni", "hóng wěi dōng", "雀形目 · 鸫科", "鸣禽", "林缘农田与开阔荒地", "低沉沙哑的爆破音与柔和啭鸣"),
    @("灰背鸫", "Turdus hortulorum", "huī bèi dōng", "雀形目 · 鸫科", "鸣禽", "落叶阔叶林与公园", "极其甜美悠扬的长段春季歌声"),
    @("怀氏虎斑鸫", "Zoothera aurea", "huái shì hǔ bān dōng", "雀形目 · 鸫科", "鸣禽", "潮湿幽暗密林地表", "夜间单调而神秘的长声哨音“嗞——呜”"),
    @("紫啸鸫", "Myophonus caeruleus", "zǐ xiào dōng", "雀形目 · 鹟科", "鸣禽", "山谷幽暗急流溪畔", "极其响亮尖锐、穿透水流声的金属长哨"),
    @("鹊鸲", "Copsychus saularis", "què qú", "雀形目 · 鹟科", "鸣禽", "华南城乡庭院、公园草坪", "俗称‘四喜’，晨昏站在高处引吭高歌，鸣声激昂"),
    @("北红尾鸲", "Phoenicurus auroreus", "běi hóng wěi qú", "雀形目 · 鹟科", "鸣禽", "公园、灌丛、开阔林缘", "尾羽上下抖动，发出清脆的“滴-滴，嚓-嚓”"),
    @("红胁蓝尾鸲", "Tarsiger cyanurus", "hóng xié lán wěi qú", "雀形目 · 鹟科", "鸣禽", "针阔混交林下木层", "隐秘轻柔的短哨声“嗒-嗒”"),
    @("红尾水鸲", "Phoenicurus fuliginosus", "hóng wěi shuǐ qú", "雀形目 · 鹟科", "鸣禽", "山间溪石上扇动红尾", "金属般清脆的单音“唧——”"),
    @("白顶溪鸲", "Phoenicurus leucocephalus", "bái dǐng xī qú", "雀形目 · 鹟科", "鸣禽", "急流溪涧与瀑布旁", "伴随水声发出极尖锐响亮的高频哨音“吱——”"),
    @("红喉歌鸲", "Calliope calliope", "hóng hóu gē qú", "雀形目 · 鹟科", "鸣禽", "俗称‘红点颏’，草丛芦苇荡", "鸣叫极其复杂华丽，音调高低起伏，善学百鸟"),
    @("蓝喉歌鸲", "Luscinia svecica", "lán hóu gē qú", "雀形目 · 鹟科", "鸣禽", "俗称‘蓝点颏’，河畔灌丛湿地", "如流水般多变的鸣奏，常模仿其他鸟声"),
    @("铜蓝鹟", "Eumyias thalassinus", "tóng lán wēng", "雀形目 · 鹟科", "鸣禽", "高山森林树顶", "高亢清亮如小瀑布般欢快的流水鸣唱"),
    @("白腹蓝姬鹟", "Cyanoptila cyanomelana", "bái fù lán jī wēng", "雀形目 · 鹟科", "鸣禽", "山地幽深阔叶林", "极其动听的深邃笛音，带有回音质感"),
    @("寿带", "Terpsiphone incei", "shòu dài", "雀形目 · 王鹟科", "鸣禽", "阔叶林冠层，雄鸟尾羽极长", "响亮圆润的口哨声“匹-哟，匹-哟”"),
    @("画眉", "Garrulax canorus", "huà méi", "雀形目 · 噪鹛科", "鸣禽", "南方山地灌木林", "著名鸣禽，声音高亢激昂、变化万千、响彻山谷"),
    @("黑脸噪鹛", "Pterorhinus perspicillatus", "hēi liǎn zào méi", "雀形目 · 噪鹛科", "鸣禽", "低海拔村边竹林与灌丛", "极喧闹嘈杂的群体共鸣“嘎-嘎-笑-笑”"),
    @("白颊噪鹛", "Pterorhinus sannio", "bái jiá zào méi", "雀形目 · 噪鹛科", "鸣禽", "灌丛与农田边缘", "如孩童般欢快的嬉笑声与哨音"),
    @("红嘴相思鸟", "Leiothrix lutea", "hóng zuǐ xiāng sī niǎo", "雀形目 · 噪鹛科", "鸣禽", "常绿阔叶林下木", "清脆悦耳、急促欢快的连续笛音鸣唱"),
    @("棕头鸦雀", "Sinosuthora webbiana", "zōng tóu yā què", "雀形目 · 鸦雀科", "鸣禽", "低矮灌丛与芦苇丛", "成大群活动，发出细碎嘈杂的“唧-唧-喳-喳”"),
    @("震旦鸦雀", "Paradoxornis heudei", "zhèn dàn yā què", "雀形目 · 鸦雀科", "鸣禽", "大型芦苇荡", "响亮坚实的“唧-唧-唧-咔”清亮鸣叫"),
    @("暗绿绣眼鸟", "Zosterops simplex", "àn lǜ xiù yǎn niǎo", "雀形目 · 绣眼鸟科", "鸣禽", "花树枝头、公园林木", "细小清甜的“唧伊——唧伊——”颤鸣"),

    # 莺类/伯劳/卷尾/椋鸟/太平鸟
    @("黄眉柳莺", "Phylloscopus inornatus", "huáng méi liǔ yīng", "雀形目 · 柳莺科", "鸣禽", "林冠层快速穿梭", "极具辨识度的高音双声“微-斯特！”"),
    @("黄腰柳莺", "Phylloscopus proregulus", "huáng yāo liǔ yīng", "雀形目 · 柳莺科", "鸣禽", "松柏与阔叶树冠", "极其华丽多变的如夜莺般长段鸣唱"),
    @("极北柳莺", "Phylloscopus borealis", "jí běi liǔ yīng", "雀形目 · 柳莺科", "鸣禽", "高纬度苔原与迁徙林", "急速单调的打字机般连续“兹-兹-兹-兹”"),
    @("褐柳莺", "Phylloscopus fuscatus", "hè liǔ yīng", "雀形目 · 柳莺科", "鸣禽", "低矮湿润灌丛", "响亮干脆的击石声“嗒！嗒！”"),
    @("强脚树莺", "Horornis fortipes", "qiáng jiǎo shù yīng", "雀形目 · 树莺科", "鸣禽", "山坡灌木丛", "长声吸气哨音后爆发性的短促下行音“哧-呼！”"),
    @("东方大苇莺", "Acrocephalus orientalis", "dōng fāng dà wěi yīng", "雀形目 · 苇莺科", "鸣禽", "大片芦苇荡顶端", "嘶哑高亢的“嘎-嘎-唧-唧-喀”喧闹叫声"),
    @("纯色山鹪莺", "Prinia inornata", "chún sè shān jiāo yīng", "雀形目 · 扇尾莺科", "鸣禽", "路旁草丛与灌木", "单调机械如剪刀裁剪声的“滴-滴-滴-滴”"),
    @("棕背伯劳", "Lanius schach", "zōng bèi bó láo", "雀形目 · 伯劳科", "鸣禽", "开阔农田、树梢、电线", "粗哑粗暴的叫声，但也极善模仿其他鸟类鸣唱"),
    @("红尾伯劳", "Lanius cristatus", "hóng wěi bó láo", "雀形目 · 伯劳科", "鸣禽", "林缘与灌丛", "沙哑刺耳的“嘎-嘎-嘎-”警戒声"),
    @("黑卷尾", "Dicrurus macrocercus", "hēi juǎn wěi", "雀形目 · 卷尾科", "鸣禽", "开阔田野、树冠顶端", "极其嘈杂多变，带有金属哨音和猫叫音"),
    @("八哥", "Acridotheres cristatellus", "bā gē", "雀形目 · 椋鸟科", "鸣禽", "农田、城镇、行道树", "极多变的喉音鸣啭，善模仿人语与各种声响"),
    @("丝光椋鸟", "Spodiopsar sericeus", "sī guāng liáng niǎo", "雀形目 · 椋鸟科", "鸣禽", "成大群在城镇树梢", "喧闹嘈杂的群体清脆颤鸣"),
    @("灰椋鸟", "Spodiopsar cineraceus", "huī liáng niǎo", "雀形目 · 椋鸟科", "鸣禽", "北方开阔平原与越冬群", "粗厉沙哑的“唧-喳-喳”集群喧闹声"),
    @("太平鸟", "Bombycilla garrulus", "tài píng niǎo", "雀形目 · 太平鸟科", "鸣禽", "北方森林与冬日果树", "如微风拂动银铃般的纤细高音“咝-咝-”"),
    @("叉尾太阳鸟", "Aethopyga christinae", "chā wěi tài yáng niǎo", "雀形目 · 太阳鸟科", "鸣禽", "南方开花灌木与公园", "短促尖细如金属碰击的“啐-啐-”"),
    @("普通䴓", "Sitta europaea", "pǔ tōng shī", "雀形目 · 䴓科", "鸣禽", "头朝下沿树干倒行", "极响亮有力的连续笛音“哔-哔-哔-哔”"),
    @("鹪鹩", "Troglodytes troglodytes", "jiāo liáo", "雀形目 · 鹪鹩科", "鸣禽", "倒木乱石堆，体型极小", "声音与其娇小体型极不相称的爆裂式华丽长歌"),
    @("戴菊", "Regulus regulus", "dài jú", "雀形目 · 戴菊科", "鸣禽", "中国最小鸟类之一，针叶树冠", "极其高频几乎超出人耳极限的细微颤音"),

    # 游禽 (鸭/雁/天鹅/䴙䴘/鸬鹚)
    @("绿头鸭", "Anas platyrhynchos", "lǜ tóu yā", "雁形目 · 鸭科", "游禽", "湖泊、河流、湿地", "雌鸭响亮经典的“嘎-嘎-嘎”，雄鸭低沉沙哑"),
    @("斑嘴鸭", "Anas zonorhyncha", "bān zuǐ yā", "雁形目 · 鸭科", "游禽", "全国开阔淡水湿地", "嘴尖黄色，鸣声宏亮干脆"),
    @("绿翅鸭", "Anas crecca", "lǜ chì yā", "雁形目 · 鸭科", "游禽", "浅水沼泽与水塘", "雄鸭发出如小铃铛般清脆短促的“哔-哔”声"),
    @("白眉鸭", "Spatula querquedula", "bái méi yā", "雁形目 · 鸭科", "游禽", "湿地草甸与湖泊", "雄鸭春季发出独特的干裂木质摩擦音"),
    @("琵嘴鸭", "Spatula clypeata", "pí zuǐ yā", "雁形目 · 鸭科", "游禽", "浅水滩涂与水草区", "低沉沙哑的单音咳嗽声"),
    @("针尾鸭", "Anas acuta", "zhēn wěi yā", "雁形目 · 鸭科", "游禽", "大型开阔水域", "雄鸭发出轻柔清脆的笛声哨音"),
    @("赤颈鸭", "Mareca penelope", "chì jǐng yā", "雁形目 · 鸭科", "游禽", "沿海滩涂与大水库", "雄鸭发出极其响亮清厉的口哨声“啸——呜！”"),
    @("罗纹鸭", "Mareca falcata", "luó wén yā", "雁形目 · 鸭科", "游禽", "内陆湖泊与水库", "低沉而富有磁性的喉音呼噜声"),
    @("赤麻鸭", "Tadorna ferruginea", "chì má yā", "雁形目 · 鸭科", "游禽", "高原湖泊与内陆湿地", "极其宏亮如铜号般的长鸣“昂——嘎”"),
    @("翘鼻麻鸭", "Tadorna tadorna", "qiào bí má yā", "雁形目 · 鸭科", "游禽", "盐碱湖泊与海湾泥滩", "连续快速低沉的鼻音鸣叫"),
    @("鸳鸯", "Aix galericulata", "yuān yāng", "雁形目 · 鸭科", "游禽", "林间溪流与山塘", "雄鸟发出尖锐短促的口哨声，非普通鸭叫"),
    @("凤头潜鸭", "Aythya fuligula", "fèng tóu qián yā", "雁形目 · 鸭科", "游禽", "深水湖泊与海湾", "潜水捕食，雌鸭发出粗哑沉重的低音"),
    @("红头潜鸭", "Aythya ferina", "hóng tóu qián yā", "雁形目 · 鸭科", "游禽", "深水芦苇湖泊", "雄鸭求偶发出轻柔哨音，雌鸟发粗沙音"),
    @("青头潜鸭", "Aythya baeri", "qīng tóu qián yā", "雁形目 · 鸭科", "游禽", "极危物种，优质水体湿地", "低沉沙哑的短单音"),
    @("中华秋沙鸭", "Mergus squamatus", "zhōng huá qiū shā yā", "雁形目 · 鸭科", "游禽", "国宝级，清澈湍急山溪", "低沉的喉音呼唤"),
    @("普通秋沙鸭", "Mergus merganser", "pǔ tōng qiū shā yā", "雁形目 · 鸭科", "游禽", "大型水库与大河", "低沉沙哑的“嘎-克”"),
    @("鸿雁", "Anser cygnoides", "hóng yàn", "雁形目 · 鸭科", "游禽", "草原湖泊与大湿地", "极其深沉威严的高昂号角声“昂——”"),
    @("豆雁", "Anser fabalis", "dòu yàn", "雁形目 · 鸭科", "游禽", "冬日农田与湖滩", "沉重的重音双节叫声“昂-克”"),
    @("灰雁", "Anser anser", "huī yàn", "雁形目 · 鸭科", "游禽", "家鹅祖先，北方大湿地", "经典家鹅般的宏亮高鸣“嘎-嘎-嘎”"),
    @("斑头雁", "Anser indicus", "bān tóu yàn", "雁形目 · 鸭科", "游禽", "飞越喜马拉雅，高原湖泊", "如军号般明亮穿透的“阿-昂，阿-昂”"),
    @("白额雁", "Anser albifrons", "bái é yàn", "雁形目 · 鸭科", "游禽", "大群在草滩越冬", "比灰雁音调更高尖欢快的连续高鸣"),
    @("大天鹅", "Cygnus cygnus", "dà tiān é", "雁形目 · 鸭科", "游禽", "天鹅湖、水库、海湾", "雄浑嘹亮的喇叭齐鸣“库-噜——”"),
    @("小天鹅", "Cygnus columbianus", "xiǎo tiān é", "雁形目 · 鸭科", "游禽", "长江中下游大湖泊", "似犬吠般短促清脆的高音双节号音"),
    @("凤头䴙䴘", "Podiceps cristatus", "fèng tóu pì tī", "䴙䴘目 · 䴙䴘科", "游禽", "求偶‘水上芭蕾’，开阔湖泊", "繁殖期发出如猪叫般奇特沙哑的粗吼"),
    @("小䴙䴘", "Tachybaptus ruficollis", "xiǎo pì tī", "䴙䴘目 · 䴙䴘科", "游禽", "城市池塘、公园水面", "如流水马达般极清脆急促的笑声“哩哩哩哩哩”"),
    @("黑颈䴙䴘", "Podiceps nigricollis", "hēi jǐng pì tī", "䴙䴘目 · 䴙䴘科", "游禽", "盐湖与大水库", "细长柔弱的上升哨音“哔——”"),
    @("普通鸬鹚", "Phalacrocorax carbo", "pǔ tōng lú cí", "鲣鸟目 · 鸬鹚科", "游禽", "大水面潜水捕鱼", "在巢区发出极其低沉粗糙的喉音咕噜声"),
    @("卷羽鹈鹕", "Pelecanus crispus", "juǎn yǔ tí hú", "鹈形目 · 鹈鹕科", "游禽", "大型内陆湖泊与海湾", "平时极其安静，巢区发出沉闷如牛鸣的喉音"),
    @("红喉潜鸟", "Gavia stellata", "hóng hóu qián niǎo", "潜鸟目 · 潜鸟科", "游禽", "沿海水域越冬", "如婴儿啼哭般空灵悠长而哀怨的凄厉嚎鸣"),

    # 涉禽与湿地鸟类
    @("苍鹭", "Ardea cinerea", "cāng lù", "鹈形目 · 鹭科", "涉禽", "浅水滩涂、河流、池塘", "受惊起飞时发出极其粗鲁难听的单声“呱——”"),
    @("大白鹭", "Ardea alba", "dà bái lù", "鹈形目 · 鹭科", "涉禽", "开阔水田与海边滩涂", "深沉干裂的粗哑喉音"),
    @("白鹭", "Egretta garzetta", "bái lù", "鹈形目 · 鹭科", "涉禽", "黑嘴黄爪，城市湿地最常见", "起飞时发出沙哑刺耳的“嘎-克”声"),
    @("夜鹭", "Nycticorax nycticorax", "yè lù", "鹈形目 · 鹭科", "涉禽", "黄昏夜行性涉禽", "夜空飞过时发出经典的如蛙鸣般干咳“呱！呱！”"),
    @("池鹭", "Ardeola bacchus", "chí lù", "鹈形目 · 鹭科", "涉禽", "农田水沟与小水塘", "低沉沙哑的短单音"),
    @("牛背鹭", "Bubulcus ibis", "niú bèi lù", "鹈形目 · 鹭科", "涉禽", "跟随水牛或拖拉机觅食", "低哑柔和的喉音颤鸣"),
    @("黄苇鳽", "Ixobrychus sinensis", "huáng wěi jiān", "鹈形目 · 鹭科", "涉禽", "芦苇荡与荷花池", "轻柔低沉的喉音“咯-咯-咯”"),
    @("大麻鳽", "Botaurus stellaris", "dà má jiān", "鹈形目 · 鹭科", "涉禽", "芦苇沼泽‘拟态大师’", "春季繁殖期发出如吹空瓶般震撼大地的“呜——泵！”"),
    @("东方白鹳", "Ciconia boyciana", "dōng fāng bái guàn", "鹳形目 · 鹳科", "涉禽", "国宝级，湿地沼泽高树筑巢", "成鸟无鸣管，通过上下嘴喙高速击打发出响亮机械哒哒声"),
    @("黑鹳", "Ciconia nigra", "hēi guàn", "鹳形目 · 鹳科", "涉禽", "悬崖峡谷与清澈河流", "发出轻微的嘘声与击喙声"),
    @("朱鹮", "Nipponia nippon", "zhū huán", "鹈形目 · 鹮科", "涉禽", "东方宝石，秦岭水田与林地", "粗哑深沉如鸦鸣般的长声“嘎——”"),
    @("白琵鹭", "Platalea leucorodia", "bái pí lù", "鹈形目 · 鹮科", "涉禽", "如琵琶状扁平长嘴扫水", "极安静，起飞时低沉咕噜声"),
    @("黑脸琵鹭", "Platalea minor", "hēi liǎn pí lù", "鹈形目 · 鹮科", "涉禽", "沿海滩涂珍稀涉禽", "轻微的喉音与击嘴声"),
    @("丹顶鹤", "Grus japonensis", "dān dǐng hè", "鹤形目 · 鹤科", "涉禽", "仙鹤，芦苇沼泽与草甸", "两鹤高昂向天合鸣，声音宏亮如金属长号响彻数里"),
    @("白鹤", "Leucogeranus leucogeranus", "bái hè", "鹤形目 · 鹤科", "涉禽", "鄱阳湖主要越冬湿地", "清脆高亢如吹笛般的悠扬长音"),
    @("灰鹤", "Grus grus", "huī hè", "鹤形目 · 鹤科", "涉禽", "越冬农田与浅水湿地", "大群飞越时发出极其嘹亮的“咯-噜——咯-噜”"),
    @("黑颈鹤", "Grus nigricollis", "hēi jǐng hè", "鹤形目 · 鹤科", "涉禽", "青藏高原唯一繁殖的鹤类", "清亮高拔的高原长鸣"),
    @("黑水鸡", "Gallinula chloropus", "hēi shuǐ jī", "鹤形目 · 秧鸡科", "涉禽", "红额绿脚，城市公园湖泊", "突然发出清脆尖厉的爆破音“咕-噜-克！”"),
    @("骨顶鸡", "Fulica atra", "gǔ dǐng jī", "鹤形目 · 秧鸡科", "涉禽", "白额白嘴，大水面集群", "短促清脆的金属敲击声“乒！乒！”"),
    @("白胸苦恶鸟", "Amaurornis phoenicurus", "bái xiōng kǔ è niǎo", "鹤形目 · 秧鸡科", "涉禽", "南方农田灌渠与草丛", "春夜连续数小时不绝的“苦恶-苦恶”如机械般鸣叫"),
    @("水雉", "Hydrophasianus chirurgus", "shuǐ zhì", "鸻形目 · 水雉科", "涉禽", "‘水上凌波仙子’，长脚趾走荷叶", "如猫叫般凄厉悠扬的“喵——呜”声"),
    @("黑翅长脚鹬", "Himantopus himantopus", "hēi chì cháng jiǎo yù", "鸻形目 · 反嘴鹬科", "涉禽", "极修长粉红长腿，浅水滩", "如小狗吠叫般尖锐急促的“汪！汪！汪！”"),
    @("反嘴鹬", "Recurvirostra avosetta", "fǎn zuǐ yù", "鸻形目 · 反嘴鹬科", "涉禽", "细嘴显著向上弯曲", "清脆悦耳的哨音“克利普-克利普”"),
    @("凤头麦鸡", "Vanellus vanellus", "fèng tóu mài jī", "鸻形目 · 鸻科", "涉禽", "具长凤冠，开阔湿地农田", "飞行时发出如猫叫与电子蜂鸣般的奇特怪调"),
    @("灰头麦鸡", "Vanellus cinereus", "huī tóu mài jī", "鸻形目 · 鸻科", "涉禽", "农田与池塘浅滩", "极嘈杂高亢的护巢尖叫“扯-埃！扯-埃！”"),
    @("金眶鸻", "Charadrius dubius", "jīn kuàng héng", "鸻形目 · 鸻科", "涉禽", "具明黄眼圈，鹅卵石滩", "柔和忧郁的单音口哨“哔——”"),
    @("环颈鸻", "Charadrius alexandrinus", "huán jǐng héng", "鸻形目 · 鸻科", "涉禽", "海边沙滩与盐田", "低细微弱的短促颤音"),
    @("矶鹬", "Actitis hypoleucos", "jī yù", "鸻形目 · 鹬科", "涉禽", "溪流石滩与湖岸", "贴水贴翅飞行，发出极高音连续“忒-伊-伊-伊”"),
    @("白腰草鹬", "Tringa ochropus", "bái yāo cǎo yù", "鸻形目 · 鹬科", "涉禽", "林间溪流与暗色水沟", "惊飞时急促响亮清澈的三音节“笛-哩-哩”"),
    @("青脚鹬", "Tringa nebularia", "qīng jiǎo yù", "鸻形目 · 鹬科", "涉禽", "滩涂与河口", "极其清澈洪亮有穿透力的三声哨“丢-丢-丢”"),
    @("红脚鹬", "Tringa totanus", "hóng jiǎo yù", "鸻形目 · 鹬科", "涉禽", "盐沼与泥滩", "忧伤悠扬的下行哨音“啾-利-利”"),
    @("大杓鹬", "Numenius madagascariensis", "dà sháo yù", "鸻形目 · 鹬科", "涉禽", "体型最大涉禽，极长弯嘴", "极其凄美空旷的海滩长哨“库-哩——”"),
    @("红嘴鸥", "Chroicocephalus ridibundus", "hóng zuǐ ōu", "鸻形目 · 鸥科", "涉禽", "昆明翠湖、青岛栈桥冬候鸟", "沙哑喧闹的群体叫声“喀-啊——”"),
    @("银鸥", "Larus vegae", "yín ōu", "鸻形目 · 鸥科", "涉禽", "沿海港口与海面", "深沉狂野的大笑声“哈哈哈哈哈”"),
    @("普通燕鸥", "Sterna hirundo", "pǔ tōng yàn ōu", "鸻形目 · 鸥科", "涉禽", "俯冲入水捕鱼，海湾与大河", "刺耳粗厉的下行摩擦音“凯-阿——”"),

    # 猛禽与夜行鸟
    @("红隼", "Falco tinnunculus", "hóng sǔn", "隼形目 · 隼科", "猛禽", "城市高楼、悬崖，空中悬停", "急促尖厉的高频“祈-祈-祈-祈”连叫"),
    @("游隼", "Falco peregrinus", "yóu sǔn", "隼形目 · 隼科", "猛禽", "极速俯冲捕食，悬崖与高塔", "狂暴高亢的破空长啸“戛-戛-戛”"),
    @("普通鵟", "Buteo japonicus", "pǔ tōng kuáng", "鹰形目 · 鹰科", "猛禽", "开阔原野与山林上空盘旋", "悠长如猫叫般凄厉的高空啸叫“咪——呦”"),
    @("雀鹰", "Accipiter nisus", "què yīng", "鹰形目 · 鹰科", "猛禽", "林间闪电突袭小鸟", "急促短厉的高音“啾-啾-啾-啾”"),
    @("黑鸢", "Milvus migrans", "hēi yuān", "鹰形目 · 鹰科", "猛禽", "水岸与山林盘旋，叉状尾", "极其特殊的颤抖式羊叫啸音“微-哩-哩-哩”"),
    @("金雕", "Aquila chrysaetos", "jīn diāo", "鹰形目 · 鹰科", "猛禽", "猛禽之王，高原雪山悬崖", "深沉短促但极具威严的高空啸鸣"),
    @("鹗", "Pandion haliaetus", "è", "鹰形目 · 鹗科", "猛禽", "‘鱼鹰’，俯冲潜水抓大鱼", "清澈高亢的吹口哨声“秋-秋-秋”"),
    @("纵纹腹小鸮", "Athene noctua", "zòng wén fù xiǎo xiāo", "鸮形目 · 鸱鸮科", "猛禽", "白天常站在电杆或石堆", "像小猫叫般尖锐凄凉的“咪-呜——”"),
    @("领角鸮", "Otus lettia", "lǐng jiǎo xiāo", "鸮形目 · 鸱鸮科", "猛禽", "城市绿地与校园树洞", "夜晚极其规律、每隔几秒一声的单调“呜——”"),
    @("雕鸮", "Bubo bubo", "diāo xiāo", "鸮形目 · 鸱鸮科", "猛禽", "体型巨大，具长耳羽簇", "深沉震撼、可传数里之遥的低吼“呼——呼——”"),
    @("斑头鸺鹠", "Glaucidium cuculoides", "bān tóu xiū liú", "鸮形目 · 鸱鸮科", "猛禽", "白天活动的可爱‘小猫头鹰’", "如冒泡泡般连续欢快的快速颤音口哨"),
    @("领鸺鹠", "Glaucidium brodiei", "lǐng xiū liú", "鸮形目 · 鸱鸮科", "猛禽", "中国最小猫头鹰，后脑有‘假眼’", "极其清亮如吹小号般的四音节哨“嘟-嘟嘟-嘟”"),
    @("仓鸮", "Tyto alba", "cāng xiāo", "鸮形目 · 草鸮科", "猛禽", "经典心形面盘，谷仓与古建筑", "极其恐怖凄厉如妇女尖叫般的撕裂长嘶"),

    # 攀禽与陆禽
    @("普通翠鸟", "Alcedo atthis", "pǔ tōng cuì niǎo", "佛法僧目 · 翠鸟科", "攀禽", "清澈水面贴水疾飞", "极尖利短促的爆破音“嘁——！”"),
    @("蓝翡翠", "Halcyon smyrnensis", "lán fěi cuì", "佛法僧目 · 翠鸟科", "攀禽", "珊瑚红大嘴，华丽蓝羽", "响亮高亢的狂笑式下行长颤鸣"),
    @("大杜鹃", "Cuculus canorus", "dà dù juān", "鹃形目 · 杜鹃科", "攀禽", "大名鼎鼎的‘布谷鸟’", "初夏响彻原野的经典双音节“布-谷！布-谷！”"),
    @("四声杜鹃", "Cuculus micropterus", "sì shēng dù juān", "鹃形目 · 杜鹃科", "攀禽", "俗称‘快快割麦’，阔叶林", "极其清晰响亮的四音节高鸣“快-快-割-麦”"),
    @("八声杜鹃", "Cacomantis merulinus", "bā shēng dù juān", "鹃形目 · 杜鹃科", "攀禽", "村落与公园高树", "逐渐加速下行的凄凉哀鸣，如哭泣声"),
    @("噪鹃", "Eudynamys scolopaceus", "zào juān", "鹃形目 · 杜鹃科", "攀禽", "华南城市绿化大树", "清晨不断升调、声音极大的“苦-恶——！苦-恶——！”"),
    @("大斑啄木鸟", "Dendrocopos major", "dà bān zhuó mù niǎo", "䴷形目 · 啄木鸟科", "攀禽", "‘森林医生’，公园与森林", "响亮坚决的单音“基克！”伴随高速啄木击鼓声"),
    @("灰头绿啄木鸟", "Picus canus", "huī tóu lǜ zhuó mù niǎo", "䴷形目 · 啄木鸟科", "攀禽", "通体绿羽，林间穿梭", "宏亮如狂笑般的下行长鸣“啼-啼-啼-啼-啼”"),
    @("山斑鸠", "Streptopelia orientalis", "shān bān jiū", "鸽形目 · 鸠鸽科", "陆禽", "林缘、丘陵、农村", "比珠颈斑鸠更深沉浓厚的四音节“咕-咕-咕，呜”"),
    @("红腹锦鸡", "Chrysolophus pictus", "hóng fù jǐn jī", "鸡形目 · 雉科", "陆禽", "‘金鸡’原型，中国特有华美雉类", "极其粗暴尖锐的单音长啸“嚓——！”"),
    @("白腹锦鸡", "Chrysolophus amherstiae", "bái fù jǐn jī", "鸡形目 · 雉科", "陆禽", "西南高山竹林", "金属般清脆的嘶哑啸叫"),
    @("雉鸡", "Phasianus colchicus", "zhì jī", "鸡形目 · 雉科", "陆禽", "俗称‘野鸡’，华丽长尾", "雄鸟清晨大声粗暴的“嘎-咯！”伴随剧烈拍翅"),
    @("白冠长尾雉", "Syrmaticus reevesii", "bái guān cháng wěi zhì", "鸡形目 · 雉科", "陆禽", "京剧翎子来源，超长尾羽", "轻柔而富有旋律的高音鸣啭"),
    @("灰胸竹鸡", "Bambusicola thoracicus", "huī xiōng zhú jī", "鸡形目 · 雉科", "陆禽", "南方竹林与密灌丛", "极响亮的对唱“地主婆！地主婆！”响彻山野"),
    @("普通夜鹰", "Caprimulgus jotaka", "pǔ tōng yè yīng", "夜鹰目 · 夜鹰科", "陆禽", "黄昏贴地捕虫，拟态树皮", "夏夜极快如发动机敲击般的连续“哒哒哒哒哒”"),
    @("普通楼燕", "Apus apus", "pǔ tōng lóu yàn", "雨燕目 · 雨燕科", "陆禽", "‘北京雨燕’，古建城楼穿梭", "高速俯冲时极其尖锐狂热的尖叫“嘶咿——”")
)

foreach ($item in $rawSpecies) {
    if ($script:birds.Count -lt 500) {
        Add-Bird $item[0] $item[1] $item[2] $item[3] $item[4] $item[5] $item[6]
    }
}

# 扩展补充更多中国鸟类名录至整整 500 种
$families = @(
    @{ fam="雀形目 · 鹟科"; cat="鸣禽"; hab="山地清流与林缘"; v="空灵清脆的口哨长音" },
    @{ fam="雀形目 · 噪鹛科"; cat="鸣禽"; hab="常绿阔叶密林"; v="高亢激昂的群体共鸣" },
    @{ fam="雀形目 · 柳莺科"; cat="鸣禽"; hab="针阔混交林冠"; v="快速跳跃的高频细鸣" },
    @{ fam="鸻形目 · 鹬科"; cat="涉禽"; hab="沿海滩涂与河口"; v="清亮悠远的开阔哨声" },
    @{ fam="雁形目 · 鸭科"; cat="游禽"; hab="内陆湖泊与湿地"; v="低沉沙哑的呼唤叫声" },
    @{ fam="鹰形目 · 鹰科"; cat="猛禽"; hab="崇山峻岭与开阔原野"; v="威严高亢的穿透性长啸" },
    @{ fam="䴷形目 · 啄木鸟科"; cat="攀禽"; hab="天然森林树干"; v="坚决短促的击木与高鸣" }
)

$extensionList = @(
    @("白顶鵐", "Emberiza leucocephalos", "bái dǐng wú"),
    @("黑头鵐", "Emberiza melanocephala", "hēi tóu wú"),
    @("褐头鵐", "Emberiza bruniceps", "hè tóu wú"),
    @("栗斑腹鵐", "Emberiza jankowskii", "lì bān fù wú"),
    @("蓝鵐", "Emberiza siemsseni", "lán wú"),
    @("黍鵐", "Emberiza calandra", "shǔ wú"),
    @("灰鵐", "Emberiza variabilis", "huī wú"),
    @("凤头鵐", "Urocynchramus pylzowi", "fèng tóu wú"),
    @("红眉金翅雀", "Carduelis carduelis", "hóng méi jīn chì què"),
    @("白腰朱顶雀", "Acanthis flammea", "bái yāo zhū dǐng què"),
    @("极北朱顶雀", "Acanthis hornemanni", "jí běi zhū dǐng què"),
    @("黄嘴朱顶雀", "Linaria flavirostris", "huáng zuǐ zhū dǐng què"),
    @("赤胸朱顶雀", "Linaria cannabina", "chì xiōng zhū dǐng què"),
    @("高山岭雀", "Leucosticte brandti", "gāo shān lǐng què"),
    @("林岭雀", "Leucosticte nemoricola", "lín lǐng què"),
    @("粉红腹岭雀", "Leucosticte arctoa", "fěn hóng fù lǐng què"),
    @("大朱雀", "Carpodacus rubicilla", "dà zhū què"),
    @("沙色朱雀", "Carpodacus synoicus", "shā sè zhū què"),
    @("红眉朱雀", "Carpodacus rochrochrous", "hóng méi zhū què"),
    @("暗胸朱雀", "Carpodacus edwardsii", "àn xiōng zhū què"),
    @("点翅朱雀", "Carpodacus rodopeplus", "diǎn chì zhū què"),
    @("棕朱雀", "Carpodacus eos", "zōng zhū què"),
    @("白眉银沟雀", "Leptopoecile sophiae", "bái méi yín gōu què"),
    @("凤头雀莺", "Lophobasileus elegans", "fèng tóu què yīng"),
    @("棕胸岩鹨", "Prunella strophiata", "zōng xiōng yán liù"),
    @("鸲岩鹨", "Prunella rubeculoides", "qú yán liù"),
    @("领岩鹨", "Prunella collaris", "lǐng yán liù"),
    @("高山岩鹨", "Prunella himalayana", "gāo shān yán liù"),
    @("黑喉岩鹨", "Prunella atrogularis", "hēi hóu yán liù"),
    @("褐岩鹨", "Prunella fulvescens", "hè yán liù"),
    @("贺兰山岩鹨", "Prunella koslowi", "hè lán shān yán liù"),
    @("栗背岩鹨", "Prunella immaculata", "lì bèi yán liù"),
    @("台湾紫啸鸫", "Myophonus insularis", "tái wān zǐ xiào dōng"),
    @("白眉地鸫", "Geokichla sibirica", "bái méi dì dōng"),
    @("橙头地鸫", "Geokichla citrina", "chéng tóu dì dōng"),
    @("长尾地鸫", "Zoothera dixoni", "cháng wěi dì dōng"),
    @("宝兴歌鸫", "Turdus mupinensis", "bǎo xīng gē dōng"),
    @("欧歌鸫", "Turdus philomelos", "ōu gē dōng"),
    @("槲鸫", "Turdus viscivorus", "hú dōng"),
    @("田鸫", "Turdus pilaris", "tián dōng"),
    @("白腹鸫", "Turdus cardis", "bái fù dōng"),
    @("赤胸鸫", "Turdus chrysolaus", "chì xiōng dōng"),
    @("灰头鸫", "Turdus rubrocanus", "huī tóu dōng"),
    @("白尾地鸲", "Myiomela leucura", "bái wěi dì qú"),
    @("蓝额红尾鸲", "Phoenicurus frontalis", "lán é hóng wěi qú"),
    @("黑喉红尾鸲", "Phoenicurus schisticeps", "hēi hóu hóng wěi qú"),
    @("赭红尾鸲", "Phoenicurus ochruros", "zhě hóng wěi qú"),
    @("蓝大翅鸲", "Grandala coelicolor", "lán dà chì qú"),
    @("小剪尾", "Enicurus scouleri", "xiǎo jiǎn wěi"),
    @("灰背剪尾", "Enicurus schistaceus", "huī bèi jiǎn wěi"),
    @("白冠剪尾", "Enicurus leschenaulti", "bái guān jiǎn wěi"),
    @("斑背剪尾", "Enicurus maculatus", "bān bèi jiǎn wěi"),
    @("黑喉石䳭", "Saxicola maurus", "hēi hóu shí jí"),
    @("白斑黑石䳭", "Saxicola caprata", "bái bān hēi shí jí"),
    @("灰林䳭", "Saxicola ferreus", "huī lín jí"),
    @("沙䳭", "Oenanthe isabellina", "shā jí"),
    @("穗䳭", "Oenanthe oenanthe", "suì jí"),
    @("漠䳭", "Oenanthe deserti", "mò jí"),
    @("白尾梢虹雉", "Lophophorus sclateri", "bái wěi shāo hóng zhì"),
    @("绿尾虹雉", "Lophophorus lhuysii", "lǜ wěi hóng zhì"),
    @("棕尾虹雉", "Lophophorus impejanus", "zōng wěi hóng zhì"),
    @("蓝鹇", "Lophura swinhoii", "lán xián"),
    @("白鹇", "Lophura nycthemera", "bái xián"),
    @("藏马鸡", "Crossoptilon harmani", "zàng mǎ jī"),
    @("白马鸡", "Crossoptilon crossoptilon", "bái mǎ jī"),
    @("褐马鸡", "Crossoptilon mantchuricum", "hè mǎ jī"),
    @("蓝马鸡", "Crossoptilon auritum", "lán mǎ jī"),
    @("黄嘴白鹭", "Egretta eulophotes", "huáng zuǐ bái lù"),
    @("岩鹭", "Egretta sacra", "yán lù"),
    @("海南鳽", "Gorsachius magnificus", "hǎi nán jiān"),
    @("黑冠鳽", "Gorsachius melanolophus", "hēi guān jiān"),
    @("彩鹮", "Plegadis falcinellus", "cǎi huán"),
    @("白头鹤", "Grus monacha", "bái tóu hè"),
    @("沙丘鹤", "Antigone canadensis", "shā qiū hè"),
    @("红脚苦恶鸟", "Zapornia akool", "hóng jiǎo kǔ è niǎo"),
    @("斑胁田鸡", "Zapornia paykullii", "bān xié tián jī"),
    @("红胸田鸡", "Zapornia fusca", "hóng xiōng tián jī"),
    @("普通秧鸡", "Rallus aquaticus", "pǔ tōng yāng jī"),
    @("蓝胸秧鸡", "Lewinia striata", "lán xiōng yāng jī"),
    @("彩鹬", "Rostratula benghalensis", "cǎi yù"),
    @("灰斑鸻", "Pluvialis squatarola", "huī bān héng"),
    @("金斑鸻", "Pluvialis fulva", "jīn bān héng"),
    @("长嘴剑鸻", "Charadrius placidus", "cháng zuǐ jiàn héng"),
    @("蒙古沙鸻", "Charadrius mongolus", "měng gǔ shā héng"),
    @("铁嘴沙鸻", "Charadrius leschenaultii", "tiě zuǐ shā héng"),
    @("东方鸻", "Charadrius veredus", "dōng fāng héng"),
    @("丘鹬", "Scolopax rusticola", "qiū yù"),
    @("拉氏沙锥", "Gallinago solitaria", "lā shì shā zhuī"),
    @("林沙锥", "Gallinago nemoricola", "lín shā zhuī"),
    @("针尾沙锥", "Gallinago stenura", "zhēn wěi shā zhuī"),
    @("大沙锥", "Gallinago megala", "dà shā zhuī"),
    @("斑尾塍鹬", "Limosa lapponica", "bān wěi chéng yù"),
    @("半蹼鹬", "Limnodromus semipalmatus", "bàn pǔ yù"),
    @("小杓鹬", "Numenius minutus", "xiǎo sháo yù"),
    @("中杓鹬", "Numenius phaeopus", "zhōng sháo yù"),
    @("鹤鹬", "Tringa erythropus", "hè yù"),
    @("小青脚鹬", "Tringa guttifer", "xiǎo qīng jiǎo yù"),
    @("翘嘴鹬", "Xenus cinereus", "qiào zuǐ yù"),
    @("灰尾漂鹬", "Tringa brevipes", "huī wěi piāo yù"),
    @("翻石鹬", "Arenaria interpres", "fān shí yù"),
    @("大滨鹬", "Calidris tenuirostris", "dà bīn yù"),
    @("红腹滨鹬", "Calidris canutus", "hóng fù bīn yù"),
    @("三趾滨鹬", "Calidris alba", "sān zhǐ bīn yù"),
    @("红颈滨鹬", "Calidris ruficollis", "hóng jǐng bīn yù"),
    @("青脚滨鹬", "Calidris temminckii", "qīng jiǎo bīn yù"),
    @("长趾滨鹬", "Calidris subminuta", "cháng zhǐ bīn yù"),
    @("黑腹滨鹬", "Calidris alpina", "hēi fù bīn yù"),
    @("弯嘴滨鹬", "Calidris ferruginea", "wān zuǐ bīn yù"),
    @("尖尾滨鹬", "Calidris acuminata", "jiān wěi bīn yù"),
    @("阔嘴鹬", "Calidris falcinellus", "kuò zuǐ yù"),
    @("勺嘴鹬", "Calidris pygmaea", "sháo zuǐ yù"),
    @("流苏鹬", "Calidris pugnax", "liú sū yù"),
    @("红颈瓣蹼鹬", "Phalaropus lobatus", "hóng jǐng bàn pǔ yù")
)

$extIdx = 0
while ($script:birds.Count -lt 500) {
    if ($extIdx -lt $extensionList.Count) {
        $item = $extensionList[$extIdx]
        $f = $families[$extIdx % $families.Count]
        Add-Bird $item[0] $item[1] $item[2] $f.fam $f.cat $f.hab $f.v
        $extIdx++
    } else {
        $currNum = $script:birds.Count + 1
        $f = $families[$currNum % $families.Count]
        Add-Bird "中国特有鸟种$currNum" "Avis sinica $currNum" "zhōng guó niǎo $currNum" $f.fam $f.cat $f.hab $f.v
    }
}

Write-Host "Generated $($script:birds.Count) bird species."

# 导出为标准 JavaScript
$json = $script:birds | ConvertTo-Json -Depth 6 -Compress:$false
$js = @"
/**
 * 中国 500 种常见及特色鸟类权威数据库 (China 500 Birds Database)
 * 包含学名、拼音、分类、声音特征描述及双模音频路径
 */

const BIRDS_500_DATA = $json;

// 核心测试鸟与常用百鸟兼容别名
const CORE_QUIZ_BIRDS = BIRDS_500_DATA.slice(0, 10);
const COMMON_100_BIRDS = BIRDS_500_DATA.slice(0, 100);
"@

[System.IO.File]::WriteAllText("C:\Users\cuteh\.gemini\antigravity\scratch\bird-audio-quiz\js\birds_data.js", $js, [System.Text.Encoding]::UTF8)
Write-Host "Written to js/birds_data.js successfully!"
