;(function(__define){
    function __requireDefaultModule(module){
        if(module && module.defaults !== undefined){
            return module.defaults
        }
        return module
    }
__define('lib/components/search/pinyin',function(){
    var maps = {
        "a": "啊锕",
        "ai": "埃挨哎唉哀皑癌蔼矮艾碍爱隘诶捱嗳嗌嫒瑷暧砹锿霭",
        "an": "鞍氨安俺按暗岸胺案谙埯揞犴庵桉铵鹌顸黯",
        "ang": "肮昂盎",
        "ao": "凹敖熬翱袄傲奥懊澳坳拗嗷噢岙廒遨媪骜聱螯鏊鳌鏖",
        "ba": "芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸茇菝萆捭岜灞杷钯粑鲅魃",
        "bai": "白柏百摆佰败拜稗薜掰鞴",
        "ban": "斑班搬扳般颁板版扮拌伴瓣半办绊阪坂豳钣瘢癍舨",
        "bang": "邦帮梆榜膀绑棒磅蚌镑傍谤蒡螃",
        "bao": "苞胞包褒雹保堡饱宝抱报暴豹鲍爆勹葆宀孢煲鸨褓趵龅",
        "bo": "剥薄玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳亳蕃啵饽檗擘礴钹鹁簸跛",
        "bei": "杯碑悲卑北辈背贝钡倍狈备惫焙被孛陂邶埤蓓呗怫悖碚鹎褙鐾",
        "ben": "奔苯本笨畚坌锛贲",
        "beng": "崩绷甭泵蹦迸唪嘣甏",
        "bi": "秘逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛匕仳俾芘荜荸吡哔狴庳愎滗濞弼妣婢嬖璧畀铋秕裨筚箅篦舭襞跸髀",
        "bia": "髟",
        "bian": "鞭边编贬扁便变卞辨辩辫遍匾弁苄忭汴缏煸砭碥稹窆蝙笾鳊",
        "biao": "标彪膘表婊骠飑飙飚灬镖镳瘭裱鳔",
        "bie": "鳖憋别瘪蹩鳘",
        "bin": "彬斌濒滨宾摈傧浜缤玢殡膑镔髌鬓",
        "bing": "兵冰柄丙秉饼炳病并禀邴摒绠枋槟燹",
        "bu": "捕卜哺补埠不布步簿部怖拊卟逋瓿晡钚醭",
        "ca": "擦嚓礤",
        "cai": "猜裁材才财睬踩采彩菜蔡",
        "can": "餐参蚕残惭惨灿骖璨粲黪",
        "cang": "苍舱仓沧藏伧",
        "cao": "操糙槽曹草艹嘈漕螬艚",
        "ce": "厕策侧册测刂帻恻",
        "cen": "岑涔",
        "ceng": "层蹭噌",
        "cha": "插叉茬茶碴搽察岔差诧猹馇汊姹杈楂槎檫钗锸镲衩",
        "chai": "拆柴豺侪茈瘥虿龇",
        "chan": "搀掺蝉馋谗缠铲产阐颤冁谄谶蒇廛忏潺澶孱羼婵嬗骣觇禅镡裣蟾躔",
        "chang": "昌猖场尝常长偿肠厂敞畅唱倡伥鬯苌菖徜怅惝阊娼嫦昶氅鲳",
        "chao": "超抄钞朝嘲潮巢吵炒怊绉晁耖",
        "che": "车扯撤掣彻澈坼屮砗",
        "chen": "郴臣辰尘晨忱沉陈趁衬称谌抻嗔宸琛榇肜胂碜龀",
        "cheng": "撑城橙成呈乘程惩澄诚承逞骋秤埕嵊徵浈枨柽樘晟塍瞠铖裎蛏酲",
        "chi": "吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽傺墀芪茌搋叱哧啻嗤彳饬沲媸敕胝眙眵鸱瘛褫蚩螭笞篪豉踅踟魑",
        "chong": "种充冲虫崇宠茺忡憧铳艟",
        "chou": "抽酬畴踌稠愁筹绸瞅丑俦圳帱惆溴妯瘳雠鲋",
        "chu": "褚臭初出橱厨躇锄雏滁除楚础储矗搐触处亍刍憷绌杵楮樗蜍蹰黜",
        "chuai": "嘬膪踹",
        "chuan": "揣川穿椽传船喘串掾舛惴遄巛氚钏镩舡",
        "chuang": "疮窗幢床闯创怆",
        "chui": "吹炊捶锤垂陲棰槌",
        "chun": "春椿醇唇淳纯蠢促莼沌肫朐鹑蝽",
        "chuo": "戳绰蔟辶辍镞踔龊",
        "ci": "疵茨磁雌辞慈瓷词此刺赐次荠呲嵯鹚螅糍趑",
        "cong": "聪葱囱匆从丛偬苁淙骢琮璁枞",
        "cou": "薮楱辏腠",
        "cu": "凑粗醋簇猝殂蹙",
        "cuan": "蹿篡窜汆撺昕爨",
        "cui": "摧崔催脆瘁粹淬翠萃悴璀榱隹",
        "cun": "村存寸磋忖皴",
        "cuo": "撮搓措挫错厝脞锉矬痤鹾蹉躜",
        "da": "搭达答瘩打大耷哒嗒怛妲疸褡笪靼鞑",
        "dai": "呆歹傣戴带殆代贷袋待逮怠埭甙呔岱迨逯骀绐玳黛",
        "dan": "耽担丹郸掸胆旦氮但惮淡诞弹蛋亻儋卩萏啖澹檐殚赕眈瘅聃箪",
        "dang": "当挡党荡档谠凼菪宕砀铛裆",
        "dao": "刀捣蹈倒岛祷导到稻悼道盗叨啁忉洮氘焘忑纛",
        "de": "德得的锝",
        "deng": "蹬灯登等瞪凳邓噔嶝戥磴镫簦",
        "di": "堤低滴迪敌笛狄涤嫡抵底地蒂第帝弟递缔氐籴诋谛邸坻莜荻嘀娣柢棣觌砥碲睇镝羝骶",
        "dia": "嗲",
        "dian": "颠掂滇碘点典靛垫电佃甸店惦奠淀殿丶阽坫埝巅玷癜癫簟踮",
        "diao": "碉叼雕凋刁掉吊钓调轺铞蜩粜貂",
        "die": "跌爹碟蝶迭谍叠佚垤堞揲喋渫轶牒瓞褶耋蹀鲽鳎",
        "ding": "丁盯叮钉顶鼎锭定订丢仃啶玎腚碇町铤疔耵酊",
        "diu": "铥",
        "dong": "东冬董懂动栋侗恫冻洞垌咚岽峒夂氡胨胴硐鸫",
        "dou": "兜抖斗陡豆逗痘蔸钭窦窬蚪篼酡",
        "du": "都督毒犊独读堵睹赌杜镀肚度渡妒芏嘟渎椟橐牍蠹笃髑黩",
        "duan": "端短锻段断缎彖椴煅簖",
        "dui": "堆兑队对怼憝碓",
        "dun": "墩吨蹲敦顿囤钝盾遁炖砘礅盹镦趸",
        "duo": "掇哆多夺垛躲朵跺舵剁惰堕咄哚缍柁铎裰踱",
        "e": "阿蛾峨鹅俄额讹娥恶厄扼遏鄂饿噩谔垩垭苊莪萼呃愕屙婀轭曷腭硪锇锷鹗颚鳄",
        "en": "恩蒽摁唔嗯",
        "er": "而儿耳尔饵洱二贰迩珥铒鸸鲕",
        "fa": "发罚筏伐乏阀法珐垡砝",
        "fan": "藩帆番翻樊矾钒凡烦反返范贩犯饭泛蘩幡犭梵攵燔畈蹯",
        "fang": "坊芳方肪房防妨仿访纺放匚邡彷钫舫鲂",
        "fei": "弗菲非啡飞肥匪诽吠肺废沸费芾狒悱淝妃绋绯榧腓斐扉祓砩镄痱蜚篚翡霏鲱",
        "fen": "芬酚吩氛分纷坟焚汾粉奋份忿愤粪偾瀵棼愍鲼鼢",
        "feng": "丰封枫蜂峰锋风疯烽逢冯缝讽奉凤俸酆葑沣砜",
        "fu": "佛否夫敷肤孵扶拂辐幅氟符伏俘服浮涪福袱甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐匐凫郛芙苻茯莩菔呋幞滏艴孚驸绂桴赙黻黼罘稃馥虍蚨蜉蝠蝮麸趺跗鳆",
        "fou": "缶",
        "ga": "噶嘎蛤尬呷尕尜旮钆",
        "gai": "该改概钙溉丐陔垓戤赅胲",
        "gan": "干甘杆柑竿肝赶感秆敢赣坩苷尴擀泔淦澉绀橄旰矸疳酐",
        "gang": "冈刚钢缸肛纲岗港戆罡颃筻",
        "gong": "杠工攻功恭龚供躬公宫弓巩汞拱贡共蕻廾咣珙肱蚣蛩觥",
        "gao": "篙皋高膏羔糕搞镐稿告睾诰郜蒿藁缟槔槁杲锆",
        "ge": "盖哥歌搁戈鸽胳疙割革葛格阁隔铬个各鬲仡哿塥嗝纥搿膈硌铪镉袼颌虼舸骼髂",
        "gei": "给",
        "gen": "根跟亘茛哏艮",
        "geng": "耕更庚羹埂耿梗哽赓鲠",
        "gou": "句钩勾沟苟狗垢构购够佝诟岣遘媾缑觏彀鸲笱篝鞲",
        "gu": "辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇嘏诂菰哌崮汩梏轱牯牿胍臌毂瞽罟钴锢瓠鸪鹄痼蛄酤觚鲴骰鹘",
        "gua": "刮瓜剐寡挂褂卦诖呱栝鸹",
        "guai": "乖拐怪哙",
        "guan": "棺关官冠观管馆罐惯灌贯倌莞掼涫盥鹳鳏",
        "guang": "光广逛犷桄胱疒",
        "gui": "瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽匦刿庋宄妫桧炅晷皈簋鲑鳜",
        "gun": "辊滚棍丨衮绲磙鲧",
        "guo": "锅郭国果裹过馘蠃埚掴呙囗帼崞猓椁虢锞聒蜮蜾蝈",
        "ha": "哈",
        "hai": "骸孩海氦亥害骇咴嗨颏醢",
        "han": "酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉邗菡撖瀚晗焓颔蚶鼾",
        "hen": "夯痕很狠恨",
        "hang": "杭航沆绗珩桁",
        "hao": "壕嚎豪毫郝好耗号浩薅嗥嚆濠灏昊皓颢蚝",
        "he": "呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺诃劾壑藿嗑嗬阖盍蚵翮",
        "hei": "嘿黑",
        "heng": "哼亨横衡恒訇蘅",
        "hong": "轰哄烘虹鸿洪宏弘红黉讧荭薨闳泓",
        "hou": "喉侯猴吼厚候后堠後逅瘊篌糇鲎骺",
        "hu": "呼乎忽瑚壶葫胡蝴狐糊湖弧虎唬护互沪户冱唿囫岵猢怙惚浒滹琥槲轷觳烀煳戽扈祜鹕鹱笏醐斛",
        "hua": "花哗华猾滑画划化话劐浍骅桦铧稞",
        "huai": "槐徊怀淮坏还踝",
        "huan": "欢环桓缓换患唤痪豢焕涣宦幻郇奂垸擐圜洹浣漶寰逭缳锾鲩鬟",
        "huang": "荒慌黄磺蝗簧皇凰惶煌晃幌恍谎隍徨湟潢遑璜肓癀蟥篁鳇",
        "hui": "灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘诙茴荟蕙哕喙隳洄彗缋珲晖恚虺蟪麾",
        "hun": "荤昏婚魂浑混诨馄阍溷缗",
        "huo": "豁活伙火获或惑霍货祸攉嚯夥钬锪镬耠蠖",
        "ji": "藉纪击圾基机畸稽积箕肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎剂悸济寄寂计记既忌际妓继居丌乩剞佶佴脔墼芨芰萁蒺蕺掎叽咭哜唧岌嵴洎彐屐骥畿玑楫殛戟戢赍觊犄齑矶羁嵇稷瘠瘵虮笈笄暨跻跽霁鲚鲫髻麂",
        "jia": "嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁伽郏拮岬浃迦珈戛胛恝铗镓痂蛱笳袈跏",
        "jian": "歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件健舰剑饯渐溅涧建僭谏谫菅蒹搛囝湔蹇謇缣枧柙楗戋戬牮犍毽腱睑锏鹣裥笕箴翦趼踺鲣鞯",
        "jiang": "僵姜将浆江疆蒋桨奖讲匠酱降茳洚绛缰犟礓耩糨豇",
        "jiao": "蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫佼僬茭挢噍峤徼姣纟敫皎鹪蛟醮跤鲛",
        "jie": "颉窖揭接皆秸街阶截劫节桔杰捷睫竭洁结姐戒芥界借介疥诫届偈讦诘喈嗟獬婕孑桀獒碣锴疖袷蚧羯鲒骱髫",
        "jin": "巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸尽卺荩堇噤馑廑妗缙瑾槿赆觐钅锓衿矜",
        "jing": "劲荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净刭儆阱菁獍憬泾迳弪婧肼胫腈旌",
        "jiong": "炯窘冂迥扃",
        "jiu": "揪究纠玖韭久灸九酒厩救旧臼舅咎就疚僦啾阄柩桕鹫赳鬏",
        "ju": "鞠拘狙疽驹菊局咀矩举沮聚拒据巨具距踞锯俱惧炬剧倨讵苣苴莒掬遽屦琚枸椐榘榉橘犋飓钜锔窭裾趄醵踽龃雎鞫",
        "juan": "捐鹃娟倦眷卷绢鄄狷涓桊蠲锩镌隽",
        "jue": "撅攫抉掘倔爵觉决诀绝厥劂谲矍蕨噘崛獗孓珏桷橛爝镢蹶觖",
        "jun": "均菌钧军君峻俊竣浚郡骏捃狻皲筠麇",
        "ka": "喀咖卡佧咔胩",
        "ke": "咯坷苛柯棵磕颗科壳咳可渴克刻客课岢恪溘骒缂珂轲氪瞌钶疴窠蝌髁",
        "kai": "开揩楷凯慨剀垲蒈忾恺铠锎",
        "kan": "阚刊堪勘坎砍看侃凵莰莶戡龛瞰",
        "kang": "康慷糠扛抗亢炕坑伉闶钪",
        "kao": "考拷烤靠尻栲犒铐",
        "ken": "肯啃垦恳垠裉颀",
        "keng": "吭忐铿",
        "kong": "空恐孔控倥崆箜",
        "kou": "抠口扣寇芤蔻叩眍筘",
        "ku": "枯哭窟苦酷库裤刳堀喾绔骷",
        "kua": "夸垮挎跨胯侉",
        "kuai": "块筷侩快蒯郐蒉狯脍",
        "kuan": "宽款髋",
        "kuang": "匡筐狂框矿眶旷况诓诳邝圹夼哐纩贶",
        "kui": "亏盔岿窥葵奎魁傀馈愧溃馗匮夔隗揆喹喟悝愦阕逵暌睽聩蝰篑臾跬",
        "kun": "坤昆捆困悃阃琨锟醌鲲髡",
        "kuo": "适括扩廓阔蛞",
        "la": "垃拉喇蜡腊辣啦剌摺邋旯砬瘌",
        "lai": "莱来赖崃徕涞濑赉睐铼癞籁",
        "lan": "蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥啉岚懔漤榄斓罱镧褴",
        "lang": "琅榔狼廊郎朗浪莨蒗啷阆锒稂螂",
        "lao": "捞劳牢老佬姥酪烙涝唠崂栳铑铹痨醪",
        "le": "勒肋仂叻嘞泐鳓",
        "lei": "雷镭蕾磊累儡垒擂类泪羸诔荽咧漯嫘缧檑耒酹",
        "ling": "棱冷拎玲菱零龄铃伶羚凌灵陵岭领另令酃塄苓呤囹泠绫柃棂瓴聆蛉翎鲮",
        "leng": "楞愣",
        "li": "梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐痢立粒沥隶力璃哩俪俚郦坜苈莅蓠藜捩呖唳喱猁溧澧逦娌嫠骊缡珞枥栎轹戾砺詈罹锂鹂疠疬蛎蜊蠡笠篥粝醴跞雳鲡鳢黧",
        "lian": "俩联莲连镰廉怜涟帘敛脸链恋炼练挛蔹奁潋濂娈琏楝殓臁膦裢蠊鲢",
        "liang": "粮凉梁粱良两辆量晾亮谅墚椋踉靓魉",
        "liao": "撩聊僚疗燎寥辽潦了撂镣廖料蓼尥嘹獠寮缭钌鹩耢",
        "lie": "列裂烈劣猎冽埒洌趔躐鬣",
        "lin": "琳林磷霖临邻鳞淋凛赁吝蔺嶙廪遴檩辚瞵粼躏麟",
        "liu": "溜琉榴硫馏留刘瘤流柳六抡偻蒌泖浏遛骝绺旒熘锍镏鹨鎏",
        "long": "龙聋咙笼窿隆垄拢陇弄垅茏泷珑栊胧砻癃",
        "lou": "楼娄搂篓漏陋喽嵝镂瘘耧蝼髅",
        "lu": "芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮垆摅撸噜泸渌漉璐栌橹轳辂辘氇胪镥鸬鹭簏舻鲈",
        "lv": "驴吕铝侣旅履屡缕虑氯律率滤绿捋闾榈膂稆褛",
        "luan": "峦孪滦卵乱栾鸾銮",
        "lue": "掠略锊",
        "lun": "轮伦仑沦纶论囵",
        "luo": "萝螺罗逻锣箩骡裸落洛骆络倮荦摞猡泺椤脶镙瘰雒",
        "ma": "妈麻玛码蚂马骂嘛吗唛犸嬷杩麽",
        "mai": "埋买麦卖迈脉劢荬咪霾",
        "man": "瞒馒蛮满蔓曼慢漫谩墁幔缦熳镘颟螨鳗鞔",
        "mang": "芒茫盲忙莽邙漭朦硭蟒",
        "meng": "氓萌蒙檬盟锰猛梦孟勐甍瞢懵礞虻蜢蠓艋艨黾",
        "miao": "猫苗描瞄藐秒渺庙妙喵邈缈缪杪淼眇鹋蜱",
        "mao": "茅锚毛矛铆卯茂冒帽貌贸侔袤勖茆峁瑁昴牦耄旄懋瞀蛑蝥蟊髦",
        "me": "么",
        "mei": "玫枚梅酶霉煤没眉媒镁每美昧寐妹媚坶莓嵋猸浼湄楣镅鹛袂魅",
        "men": "门闷们扪玟焖懑钔",
        "mi": "眯醚靡糜迷谜弥米觅泌蜜密幂芈冖谧蘼嘧猕獯汨宓弭脒敉糸縻麋",
        "mian": "棉眠绵冕免勉娩缅面沔湎腼眄",
        "mie": "蔑灭咩蠛篾",
        "min": "民抿皿敏悯闽苠岷闵泯珉",
        "ming": "明螟鸣铭名命冥茗溟暝瞑酩",
        "miu": "谬",
        "mo": "摸摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谟茉蓦馍嫫镆秣瘼耱蟆貊貘",
        "mou": "谋牟某厶哞婺眸鍪",
        "mu": "拇牡亩姆母墓暮幕募慕木目睦牧穆仫苜呒沐毪钼",
        "na": "拿哪呐钠那娜纳内捺肭镎衲箬",
        "nai": "能氖乃奶耐奈鼐艿萘柰",
        "nan": "南男难囊喃囡楠腩蝻赧",
        "nang": "攮哝囔馕曩",
        "nao": "挠脑恼闹孬垴猱瑙硇铙蛲",
        "ne": "淖呢讷",
        "nei": "馁",
        "nen": "嫩枘恁",
        "ni": "妮霓倪泥尼拟你匿腻逆溺伲坭猊怩滠昵旎祢慝睨铌鲵",
        "nian": "蔫拈年碾撵捻念廿辇黏鲇鲶",
        "niang": "娘酿",
        "niao": "鸟尿茑嬲脲袅",
        "nie": "乜捏聂孽啮镊镍涅陧蘖嗫肀颞臬蹑",
        "nin": "您柠",
        "ning": "狞凝宁拧泞佞蓥咛甯聍",
        "niu": "牛扭钮纽狃忸妞蚴",
        "nou": "耨",
        "nong": "脓浓农侬",
        "nu": "奴努怒呶帑弩胬孥驽",
        "nv": "女恧钕衄",
        "nuan": "暖",
        "nuenue": "虐",
        "nue": "疟谑",
        "nuo": "挪懦糯诺傩搦喏锘",
        "ou": "区哦欧鸥殴藕呕偶沤怄瓯耦",
        "pa": "啪趴爬帕怕琶葩筢",
        "pai": "拍排牌徘湃派俳蒎",
        "pan": "攀潘盘磐盼畔判叛爿泮袢襻蟠蹒",
        "pang": "乓庞旁耪胖滂逄",
        "pao": "抛咆刨炮袍跑泡匏狍庖脬疱",
        "pei": "呸胚培裴赔陪配佩沛掊辔帔淠旆锫醅霈",
        "pen": "喷盆湓",
        "peng": "砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯堋嘭怦蟛",
        "pi": "砒霹批披劈琵毗啤脾疲皮匹痞僻屁譬丕陴邳郫圮鼙擗噼庀媲纰枇甓睥罴铍痦癖疋蚍貔",
        "pian": "篇偏片骗谝骈犏胼褊翩蹁",
        "piao": "朴飘漂瓢票剽嘌嫖缥殍瞟螵",
        "pie": "撇瞥丿苤氕",
        "pin": "拼频贫品聘拚姘嫔榀牝颦",
        "ping": "乒坪苹萍平凭瓶评屏俜娉枰鲆",
        "po": "繁坡泼颇婆破魄迫粕叵鄱溥珀钋钷皤笸",
        "pou": "剖裒踣",
        "pu": "扑铺仆莆葡菩蒲埔圃普浦谱曝瀑匍噗濮璞氆镤镨蹼",
        "qi": "期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫亟亓圻芑萋葺嘁屺岐汔淇骐绮琪琦杞桤槭欹祺憩碛蛴蜞綦綮趿蹊鳍麒",
        "qia": "掐恰洽葜",
        "qian": "牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉佥阡芊芡荨掮岍悭慊骞搴褰缱椠肷愆钤虔箝",
        "qiang": "枪呛腔羌墙蔷强抢嫱樯戗炝锖锵镪襁蜣羟跫跄",
        "qiao": "橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍劁诮谯荞愀憔缲樵毳硗跷鞒",
        "qie": "切茄且怯窃郄唼惬妾挈锲箧",
        "qin": "覃钦侵亲秦琴勤芹擒禽寝沁芩蓁蕲揿吣嗪噙溱檎螓衾",
        "qing": "青轻氢倾卿清擎晴氰情顷请庆倩苘圊檠磬蜻罄箐謦鲭黥",
        "qiong": "琼穷邛茕穹筇銎",
        "qiu": "仇秋丘邱球求囚酋泅俅氽巯艽犰湫逑遒楸赇鸠虬蚯蝤裘糗鳅鼽",
        "qu": "趋蛆曲躯屈驱渠取娶龋趣去诎劬蕖蘧岖衢阒璩觑氍祛磲癯蛐蠼麴瞿黢",
        "quan": "圈颧权醛泉全痊拳犬券劝诠荃獾悛绻辁畎铨蜷筌鬈",
        "que": "缺炔瘸却鹊榷确雀阙悫",
        "qun": "裙群逡",
        "ran": "然燃冉染苒髯",
        "rang": "瓤壤攘嚷让禳穰",
        "rao": "饶扰绕荛娆桡",
        "ruo": "惹若弱",
        "re": "热偌",
        "ren": "壬仁人忍韧任认刃妊纫仞荏葚饪轫稔衽",
        "reng": "扔仍",
        "ri": "日",
        "rong": "戎茸蓉荣融熔溶容绒冗嵘狨缛榕蝾",
        "rou": "揉柔肉糅蹂鞣",
        "ru": "茹蠕儒孺如辱乳汝入褥蓐薷嚅洳溽濡铷襦颥",
        "ruan": "软阮朊",
        "rui": "蕊瑞锐芮蕤睿蚋",
        "run": "闰润",
        "sa": "撒洒萨卅仨挲飒",
        "sai": "腮鳃塞赛噻",
        "san": "三叁伞散彡馓氵毵糁霰",
        "sang": "桑嗓丧搡磉颡",
        "sao": "搔骚扫嫂埽臊瘙鳋",
        "se": "瑟色涩啬铩铯穑",
        "sen": "森",
        "seng": "僧",
        "sha": "莎砂杀刹沙纱傻啥煞脎歃痧裟霎鲨",
        "shai": "筛晒酾",
        "shan": "单珊苫杉山删煽衫闪陕擅赡膳善汕扇缮剡讪鄯埏芟潸姗骟膻钐疝蟮舢跚鳝",
        "shang": "墒伤商赏晌上尚裳垧绱殇熵觞",
        "shao": "召梢捎稍烧芍勺韶少哨邵绍劭苕潲蛸笤筲艄",
        "she": "折奢赊蛇舌舍赦摄射慑涉社设厍佘猞畲麝",
        "shen": "砷申呻伸身深娠绅神沈审婶甚肾慎渗诜谂吲哂渖椹矧蜃",
        "sheng": "声生甥牲升绳省盛剩胜圣丞渑媵眚笙",
        "shi": "师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬仕侍释饰氏市恃室视试谥埘莳蓍弑唑饣轼耆贳炻礻铈铊螫舐筮豕鲥鲺",
        "shou": "收手首守寿授售受瘦兽扌狩绶艏",
        "shu": "蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱恕倏塾菽忄沭涑澍姝纾毹腧殳镯秫鹬",
        "shua": "刷耍唰涮",
        "shuai": "摔衰甩帅蟀",
        "shuan": "栓拴闩",
        "shuang": "霜双爽孀",
        "shui": "谁水睡税",
        "shun": "吮瞬顺舜恂",
        "shuo": "说硕朔烁蒴搠嗍濯妁槊铄",
        "si": "斯撕嘶思私司丝死肆寺嗣四伺似饲巳厮俟兕菥咝汜泗澌姒驷缌祀祠锶鸶耜蛳笥",
        "song": "松耸怂颂送宋讼诵凇菘崧嵩忪悚淞竦",
        "sou": "搜艘擞嗽叟嗖嗾馊溲飕瞍锼螋",
        "su": "苏酥俗素速粟僳塑溯宿诉肃夙谡蔌嗉愫簌觫稣",
        "suan": "酸蒜算",
        "sui": "眭虽隋随绥髓碎岁穗遂隧祟蓑冫谇濉邃燧睢",
        "sun": "孙损笋荪狲飧榫跣隼",
        "suo": "梭唆缩琐索锁所唢嗦娑桫睃羧",
        "ta": "塌他它她塔獭挞蹋踏闼溻遢榻沓",
        "tai": "胎苔抬台泰酞太态汰邰薹肽炱钛跆鲐",
        "tan": "坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭郯蕈昙钽锬",
        "tang": "汤塘搪堂棠膛唐糖傥饧溏瑭铴镗耥螗螳羰醣",
        "thang": "倘躺淌",
        "theng": "趟烫",
        "tao": "掏涛滔绦萄桃逃淘陶讨套挑鼗啕韬饕",
        "te": "特",
        "teng": "藤腾疼誊滕",
        "ti": "梯剔踢锑提题蹄啼体替嚏惕涕剃屉荑悌逖绨缇鹈裼醍",
        "tian": "天添填田甜恬舔腆掭忝阗殄畋钿蚺",
        "tiao": "条迢眺跳佻祧铫窕龆鲦",
        "tie": "贴铁帖萜餮",
        "ting": "厅听烃汀廷停亭庭挺艇莛葶婷梃蜓霆",
        "tong": "通桐酮瞳同铜彤童桶捅筒统痛佟僮仝茼嗵恸潼砼",
        "tou": "偷投头透亠",
        "tu": "凸秃突图徒途涂屠土吐兔堍荼菟钍酴",
        "tuan": "湍团疃",
        "tui": "推颓腿蜕褪退忒煺",
        "tun": "吞屯臀饨暾豚窀",
        "tuo": "拖托脱鸵陀驮驼椭妥拓唾乇佗坨庹沱柝砣箨舄跎鼍",
        "wa": "挖哇蛙洼娃瓦袜佤娲腽",
        "wai": "歪外",
        "wan": "豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕剜芄苋菀纨绾琬脘畹蜿箢",
        "wang": "汪王亡枉网往旺望忘妄罔尢惘辋魍",
        "wei": "威巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫倭偎诿隈葳薇帏帷崴嵬猥猬闱沩洧涠逶娓玮韪軎炜煨熨痿艉鲔",
        "wen": "瘟温蚊文闻纹吻稳紊问刎愠阌汶璺韫殁雯",
        "weng": "嗡翁瓮蓊蕹",
        "wo": "挝蜗涡窝我斡卧握沃莴幄渥杌肟龌喔",
        "wu": "巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误兀仵阢邬圬芴庑怃忤浯寤迕妩骛牾焐鹉鹜蜈鋈鼯",
        "xi": "厘昔熙析西硒矽晰嘻吸锡牺稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细僖兮隰郗茜葸蓰奚唏徙饩阋浠淅屣嬉玺樨曦觋欷熹禊禧钸皙穸蜥蟋舾羲粞翕醯鼷",
        "xia": "瞎虾匣霞辖暇峡侠狭下厦夏吓掀葭嗄狎遐瑕硖瘕罅黠",
        "xian": "冼锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线藓岘猃暹娴氙祆鹇痫蚬筅籼酰跹",
        "xiang": "相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象芗葙饷庠骧缃蟓鲞飨",
        "xiao": "萧硝霄削哮嚣销消宵淆晓小孝校肖啸笑效哓咻崤潇逍骁绡枭枵筱箫魈",
        "xie": "解楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑偕亵勰燮薤撷廨瀣邂绁缬榭榍歙躞",
        "xin": "薪芯锌欣辛新忻心信衅囟馨莘歆铽鑫",
        "xing": "星腥猩惺兴刑型形邢行醒幸杏性姓陉荇荥擤悻硎",
        "xiong": "兄凶胸匈汹雄熊芎",
        "xiu": "休修羞朽嗅锈秀袖绣莠岫馐庥鸺貅髹",
        "xu": "墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续讴诩圩蓿怵洫溆顼栩煦砉盱胥糈醑",
        "xuan": "轩喧宣悬旋玄选癣眩绚儇谖萱揎馔泫洵渲漩璇楦暄炫煊碹铉镟痃",
        "xue": "靴薛学穴雪血噱泶鳕",
        "xun": "勋熏循旬询寻驯巡殉汛训讯逊迅巽埙荀薰峋徇浔曛窨醺鲟",
        "ya": "压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶伢揠吖岈迓娅琊桠氩砑睚痖",
        "yan": "焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验厣靥赝俨偃兖讠谳郾鄢芫菸崦恹闫阏洇湮滟妍嫣琰晏胭腌焱罨筵酽魇餍鼹",
        "yang": "殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾徉怏泱炀烊恙蛘鞅",
        "yao": "邀腰妖瑶摇尧遥窑谣姚咬舀药要耀夭爻吆崾徭瀹幺珧杳曜肴鹞窈繇鳐",
        "ye": "椰噎耶爷野冶也页掖业叶曳腋夜液谒邺揶馀晔烨铘",
        "yi": "一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎刈劓佾诒圪圯埸懿苡薏弈奕挹弋呓咦咿噫峄嶷猗饴怿怡悒漪迤驿缢殪贻旖熠钇镒镱痍瘗癔翊衤蜴舣羿翳酏黟",
        "yin": "茵荫因殷音阴姻吟银淫寅饮尹引隐印胤鄞堙茚喑狺夤氤铟瘾蚓霪龈",
        "ying": "英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映嬴郢茔莺萦撄嘤膺滢潆瀛瑛璎楹鹦瘿颍罂",
        "yo": "哟唷",
        "yong": "拥佣臃痈庸雍踊蛹咏泳涌永恿勇用俑壅墉慵邕镛甬鳙饔",
        "you": "幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼卣攸侑莸呦囿宥柚猷牖铕疣蝣鱿黝鼬",
        "yu": "迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉浴寓裕预豫驭禺毓伛俣谀谕萸蓣揄喁圄圉嵛狳饫庾阈妪妤纡瑜昱觎腴欤於煜燠聿钰鹆瘐瘀窳蝓竽舁雩龉",
        "yuan": "鸳渊冤元垣袁原援辕园圆猿源缘远苑愿怨院塬沅媛瑗橼爰眢鸢螈鼋",
        "yue": "乐曰约越跃钥岳粤月悦阅龠樾刖钺",
        "yun": "员耘云郧匀陨允运蕴酝晕韵孕郓芸狁恽纭殒昀氲",
        "za": "匝砸杂拶咂",
        "zai": "栽哉灾宰载再在咱崽甾",
        "zan": "攒暂赞瓒昝簪糌趱錾",
        "zang": "赃脏葬奘戕臧",
        "zao": "遭糟凿藻枣早澡蚤躁噪造皂灶燥唣缫",
        "ze": "责择则泽仄赜啧迮昃笮箦舴",
        "zei": "贼",
        "zen": "怎谮",
        "zeng": "增憎曾赠缯甑罾锃",
        "zha": "查扎喳渣札轧铡闸眨栅榨咋乍炸诈揸吒咤哳怍砟痄蚱齄",
        "zhai": "翟祭摘斋宅窄债寨砦",
        "zhan": "瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽谵搌旃",
        "zhang": "樟章彰漳张掌涨杖丈帐账仗胀瘴障仉鄣幛嶂獐嫜璋蟑",
        "zhao": "招昭找沼赵照罩兆肇爪诏棹钊笊",
        "zhe": "遮哲蛰辙者锗蔗这浙谪陬柘辄磔鹧蜇赭",
        "zhen": "珍斟真甄砧臻贞针侦枕疹诊震振镇阵缜桢榛轸赈胗朕祯畛鸩",
        "zheng": "蒸挣睁征狰争怔整拯正政帧症郑证诤峥钲铮筝",
        "zhi": "芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒卮陟郅埴芷摭帙忮彘咫骘栉枳栀桎轵轾攴贽膣祉祗黹雉鸷痣蛭絷酯跖踬踯豸觯",
        "zhong": "中盅忠钟衷终肿重仲众冢锺螽舂舯踵",
        "zhou": "舟周州洲诌粥轴肘帚咒皱宙昼骤啄着倜诹荮鬻纣胄碡籀舳酎鲷",
        "zhu": "珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑住注祝驻伫侏邾苎茱洙渚潴驺杼槠橥炷铢疰瘃蚰竺箸翥躅麈",
        "zhua": "抓",
        "zhuai": "拽",
        "zhuan": "专砖转撰赚篆抟啭颛",
        "zhuang": "桩庄装妆撞壮状丬",
        "zhui": "椎锥追赘坠缀萑骓缒",
        "zhun": "谆准",
        "zhuo": "捉拙卓桌琢茁酌灼浊倬诼廴蕞擢啜浞涿杓焯禚斫",
        "zi": "兹咨资姿滋淄孜紫仔籽滓子自渍字谘嵫姊孳缁梓辎赀恣眦锱秭耔笫粢觜訾鲻髭",
        "zong": "鬃棕踪宗综总纵腙粽",
        "zou": "邹走奏揍鄹鲰",
        "zu": "租足卒族祖诅阻组俎菹啐徂驵蹴",
        "zuan": "钻纂攥缵",
        "zui": "嘴醉最罪",
        "zun": "尊遵撙樽鳟",
        "zuo": "昨左佐柞做作坐座阝阼胙祚酢"
    }

    //多音字
    var polyphone = {
        "贲": ["bi"],
        "薄": ["bao"],
        "颉": ["xie", "jia"],
        "牟": ["mu"],
        "莘": ["shen"],
        "殷": ["yan"],
        "隽": ["jun"],
        "奇": ["ji"],
        "宓": ["fu"],
        "覃": ["tan"],
        "谌": ["shen"],
        "隗": ["wei"],
        "秘": ["mi"],
        "褚": ["zhu"],
        "弗": ["fu"],
        "藉": ["jie"],
        "适": ["shi"],
        "句": ["ju"],
        "繁": ["fan"],
        "乜": ["mie"],
        "仇": ["chou"],
        "朴": ["po"],
        "眭": ["gui"],
        "员": ["yuan"],
        "厘": ["ji"],
        "查": ["cha"],
        "宿": ["xiu"],
        "缪": ["mou", "miu", "mu", "liao"],
        "解": ["jie"],
        "区": ["qu"],
        "能": ["neng"],
        "阿": ["a"],
        "都": ["dou"],
        "盖": ['ge','gai'],
        "种": ["zhong"],
        "曾": ["ceng"],
        "乐": ["le"],
        "折": ["zhe"],
        "翟": ["di"],
        "召": ["zhao"],
        "柏": ["bo"],
        "乘": ["sheng"],
        "长": ["zhang"],
        "辟": ["pi"],
        "铅": ["yan"],
        "茄": ["jia"],		
        "单": ["dan"]
    }

    var data = {}, word, wrods, temp, i, j = 0;

    for(i in maps){
        words = maps[i].split(''), len = words.length;
        for(j=0; j<len; j++){
            word = words[j];
            data[word] = [i];
            if(temp = polyphone[word]){
                data[word] = data[word].concat(temp)
            }
        }
    }

    return data
})
__define('lib/core/events',function(){
    return function(opts){
        var self = this, that = opts || self,
            constr = that.constructor,
            isComponent = constr && constr.__component_name,
            elem = self.element || that.element || Nui.doc, 
            events = isComponent ? that._events : that.events;
        if(!elem || !events){
            return that
        }

        if(typeof events === 'function'){
            events = events.call(that)
        }

        if(!(elem instanceof jQuery)){
            elem = jQuery(elem)
        }

        var evt, ele, ret;
        var callback = function(e, elem, cbs){
            if(typeof cbs === 'function'){
                cbs.call(that, e, elem);
            }
            else{
                var _cb, _that;
                Nui.each(cbs, function(cb, i){
                    if(typeof (_cb = that[cb]) === 'function'){
                        _that = that;
                    }
                    else if(typeof (_cb = self[cb]) === 'function'){
                        _that = self;
                    }
                    if(_that){
                        return ret = _cb.call(_that, e, elem, ret);
                    }
                })
            }
        }

        Nui.each(events, function(cbs, evts){
            if(cbs && (typeof cbs === 'string' || typeof cbs === 'function')){
                if(typeof cbs === 'string'){
                    cbs = Nui.trim(cbs).split(/\s+/);
                }
                evts = Nui.trim(evts).split(/\s+/);
                // keyup:kupdown:focus a => elem.on('keyup kupdown focus', 'a', callback)
                evt = evts.shift().replace(/:/g, ' ');
                ele = evts.join(' ');
                //组件内部处理
                if(isComponent){
                    that._on(evt, elem, ele, function(e, elem){
                        callback(e, elem, cbs)
                    })
                }
                else{
                    elem.on(evt, ele, function(e){
                        callback(e, jQuery(this), cbs)
                    })
                }
            }
        })
        return that
    }
})
/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 实用工具集
 */

__define('lib/core/util',{
    
    /**
     * @func 常用正则表达式
     */
    regex:{
        //手机
        mobile:/^0?1[3-9][0-9]{9}$/,
        //电话
        tel:/^[0-9-()（）]{7,18}$/,
        //邮箱
        email:/^\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
        //身份证
        idcard:/^\d{17}[\d|x]|\d{15}$/,
        //中文
        cn:/^[\u4e00-\u9fa5]+$/,
        //税号
        taxnum:/^[a-zA-Z0-9]{15,20}$/
    },

    /**
     * @func 四舍五入保留小数，原生toFixed会有精度问题
     * @return <String>
     * @param digit <String, Number> 待转换数字
     * @param decimal <Number> 保留位数
     * @param number <Number> 小数部分末尾最多显示0的数量
     */
    toFixed:function(digit, decimal, number){
        if(isNaN(digit) || digit === ''){
            return digit
        }

        //默认末尾只保留2个0
        if(number === undefined){
            number = 2
        }

        decimal = decimal || 0;

        //将数字转换为字符串，用于分割
        var value = digit.toString();

        //补零
        var mend = function(num){
            var zero = '';
            while(num > 0){
                zero += '0';
                num--
            }
            return zero
        }

        //正负数
        var pre = '';
        if(value < 0){
            value = value.replace('-', '');
            pre = '-';
        }

        //获取小数点所在位置
        var i = value.indexOf('.');
        //存在小数点
        if(i !== -1 && decimal >= 0){
            var integer = parseInt(value.substr(0, i));
            //小数部分转为0.xxxxx
            var _decimal = '0' + value.substr(i);
            var num = '1' + mend(decimal);
            _decimal = (Math.round(_decimal*num)/num).toFixed(decimal);
            //小数四舍五入后，若大于等于1，整数部分需要加1
            if(_decimal >= 1){
                integer = (integer + 1).toString()
            }
            value = pre + integer + _decimal.substr(1)
        }
        //整数就直接补零
        else if(decimal > 0){
            value = pre + value + '.' + mend(decimal)
        }

        if(number !== null && number >= 0 && number < decimal){
            value = value.replace(/0+$/, '');
            var i = value.indexOf('.'), len = 0;
            if(i !== -1){
                len = value.substr(i+1).length;
            }
            while(len < number){
                value = value + '0';
                len++;
            }
            value = value.replace(/\.$/, '');
        }
        
        return value
    },

    /**
     * @func 获取url参数值
     * @return <String, Object>
     * @param name <String, Undefined> 参数名，不传则以对象形式返回全部参数
     * @param urls <String, Undefined> url地址，默认为当前访问地址
     */
    getParam:function(name, urls){
        var url = decodeURI(urls||location.href), value = {};
        startIndex = url.indexOf('?');
        if(startIndex++ > 0){
            var param = url.substr(startIndex).split('&'), temp;
            Nui.each(param, function(val){
                temp = val.split('=');
                value[temp[0]] = temp[1];
            });
        }
        if(typeof name === 'string' && name){
            value = (temp = value[name]) !== undefined ? temp : '';
        }
        return value;
    },

    /**
     * @func 设置url参数值
     * @return <String> 设置后的url
     * @param name <String, Object> 参数名或者{key:value, ...}参数集合
     * @param value <String> 参数值或者url
     * @param urls <String, Undefined> url，没有则获取浏览器url
     */
    setParam:function(name, value, urls){
        var self = this, url;
        if(Nui.type(name, 'Object')){
            url = value||location.href;
            Nui.each(name, function(val, key){
                if(val || val === 0){
                    url = self.setParam(key, val, url);
                }
            });
        }
        else{
            url = urls||location.href;
            if(url.indexOf('?') === -1){
                url += '?';
            }
            if(url.indexOf(name+'=') !== -1){
                var reg = new RegExp('('+name+'=)[^&]*');
                url = url.replace(reg, '$1'+value);
            }
            else{
                var and = '';
                if(url.indexOf('=') !== -1){
                    and = '&';
                }
                url += and+name+'='+value;
            }
        }
        return url;
    },

    /**
     * @func 检测浏览器是否支持CSS3属性
     * @return <Boolean>
     * @param style <String> 样式属性
     */
    supportCss3:function(style){
        var prefix = ['webkit', 'Moz', 'ms', 'o'],
            i, humpString = [],
            htmlStyle = document.documentElement.style,
            _toHumb = function (string) {
                return string.replace(/-(\w)/g, function ($0, $1) {
                    return $1.toUpperCase();
                });
            };
        for (i in prefix)
            humpString.push(_toHumb(prefix[i] + '-' + style));
        humpString.push(_toHumb(style));
        for (i in humpString)
            if (humpString[i] in htmlStyle) return true;
        return false;
    },

    /**
     * @func 检测浏览器是否支持Html5属性
     * @return <Boolean>
     * @param attr <String> 属性
     * @param element <String> DOM元素标签
     */
    supportHtml5:function(attr, element){
        return attr in document.createElement(element);
    },

    /**
     * @func 模拟location.href跳转
     * @return <Undefined>
     * @param url <String> 跳转的url
     * @param target <String> 跳转类型，默认为_self
     */
    location:function(url, target){
        if(url){
            jQuery('<a href="'+ url +'"'+ (target ? 'target="'+ (target||'_self') +'"' : '' ) +'><span></span></a>')
                .appendTo('body').children().click().end().remove();
        }
    },

    /**
     * @func 格式化日期
     * @return <String>
     * @param timestamp <String, Number> 时间戳，为空返回横杠“-”
     * @param format <String, Undefined> 输出格式，为空则返回时间戳
     */
    formatDate:function(timestamp, format){
        if(timestamp = parseInt(timestamp)){
            if(!format){
                return timestamp;
            }
            var date = new Date(timestamp);
            var map = {
                'M':date.getMonth()+1,
                'd':date.getDate(),
                'h':date.getHours(),
                'm':date.getMinutes(),
                's':date.getSeconds()
            }
            format = format.replace(/([yMdhms])+/g, function(all, single){
                var value = map[single];
                if(value !== undefined){
                    if(all.length > 1){
                       value = '0' + value;
                       value = value.substr(value.length-2);
                   }
                   return value;
                }
                else if(single === 'y'){
                    return (date.getFullYear() + '').substr(4-all.length);
                }
                return all;
            });
            return format;
        }
        return '-';
    },

    /**
     * @func 获取表单数据集合
     * @return <Object>
     * @param element <jQuery Object> 表单元素集合或者form元素
     * @param item <String> 将name相同表单元素值分隔，当设置为jquery选择器时，配合field参数使用，用于获取item中表单元素的数据集合
     * @param field <String> 字段名，配合item参数使用，返回对象中会包含该字段
     * @example
     * <form id="form">
     *  <input type="hidden" name="name0" value="0">
     * <div>
     *  <input type="hidden" name="name1" value="1">
     *  <input type="hidden" name="name2" value="2">
     * </div>
     * <div>
     *  <input type="hidden" name="name1" value="3">
     *  <input type="hidden" name="name2" value="4">
     * </div>
     * <form>
     * getData($('#form'), 'div', 'list').result => 
     * {
     *  name0:'0',
     *  list:[{
     *      name1:'1',
     *      name2:'2'
     *  }, {
     *      name1:'3',
     *      name2:'4'
     *  }]
     * }
     */
    getData:function(element, item, field){
        var that = this;
    	var data = {
    		'result':{},
    		'voids':0, //字段中空值数量
            'total':0 //总计多少个字段
        }
        if(element.length){
            var arr = element.serializeArray();
            if(!arr.length){
                arr = element.find('[name]').serializeArray();
            }
            var div = ',';
            if(item && typeof item === 'string' && !field){
                div = item
            }
            Nui.each(arr, function(v, i){
                var val = Nui.trim(v.value)
                data.total++;
                if(!val){
                    data.voids++
                }
                var name = v.name;
                if(!Nui.isArray(data.result[name])){
                    data.result[name] = [];
                }
                data.result[name].push(val)
            })
            Nui.each(data.result, function(v, k){
                data.result[k] = v.join(div)
            })
            if(item && field){
                var once = false;
                data.result[field] = [];
                element.find(item).each(function(){
                    var result = that.getData($(this).find('[name]')).result;
                    if(item !== true && !once){
                        Nui.each(result, function(v, k){
                            delete data.result[k];
                        });
                        once = true
                    }
                    data.result[field].push(result)
                })
            }
        }
        return data;
    },
    /**
     * @func 获取输入框内光标位置
     * @return <Number>
     * @param element <DOM Object> 表单元素dom对象
     */
    getFocusIndex:function(element){
        var val = Nui.trim(element.value);
        var index = val.length;
        if(element.setSelectionRange){
            index = element.selectionStart;
        }
        else{
            //ie
            try{
                var temp = document.selection.createRange();
                var textRange = element.createTextRange();
                textRange.setEndPoint('endtoend', temp);
                index = textRange.text.length;
            }
            catch(e){}
        }
        return index;
    },
    /**
     * @func 检测页面是否有文本被选择
     * @return <Boolean>
     */
    isTextSelect:function(){
        var text = '';
        //ie10以及以下浏览器
        if(document.selection){
            text =  document.selection.createRange().text;
        }
        //火狐和ie11浏览器getSelection无法获取表单元素选中文本
        else if(navigator.userAgent.toLowerCase().indexOf('gecko') !== -1){
            var textArea = document.activeElement;
            text = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
        }
        //chrome safari opera
        else if(window.getSelection){
            text = window.getSelection().toString();
        }
        //低版本chrome
        else if(document.getSelection){
            text = document.getSelection().toString();
        }
        return !!text;
    },
    /**
     * @func 检测是否需要安装PDF阅读器
     * @return <Boolean>
     */
    isInstallPDF:function(){
        var i, len;

        var flag = true;

        if(Nui.browser.webkit || (Nui.browser.mozilla && Nui.browser.version > 19)){
            flag = false;
        }

        if(navigator.plugins && (len = navigator.plugins.length)){
            for(i = 0; i < len; i++){
                if(/Adobe Reader|Adobe PDF|Acrobat|Chrome PDF Viewer/.test(navigator.plugins[i].name)){
                    flag = false;
                    break;
                }
            }
        }
        try{
            if(window.ActiveXObject || window.ActiveXObject.prototype){
                for(i = 1; i < 10; i++){
                    try{
                        if(eval("new ActiveXObject('PDF.PdfCtrl." + i + "');")){
                            flag = false;
                            break;
                        }
                    }
                    catch(e){
                        flag = true;
                    }
                }

                var arr = ['PDF.PdfCtrl', 'AcroPDF.PDF.1', 'FoxitReader.Document', 'Adobe Acrobat', 'Adobe PDF Plug-in'];
                len = arr.length;
                for(i = 0; i < len; i++){
                    try{
                        if(new ActiveXObject(arr[i])){
                            flag = false;
                            break;
                        }

                    }
                    catch(e){
                        flag = true;
                    }
                }
            }
        }
        catch(e){}

        return flag;
    },
    /**
     * @func 检测是否需要安装flash，没有安装则返回安装路径
     * @return <Boolean, String>
     */
    isInstallFlash:function(){
        if(typeof window.ActiveXObject != 'undefined'){
            try{
                if(!!new ActiveXObject('ShockwaveFlash.ShockwaveFlash')){
                    return false
                }
            }
            catch(e){}
        }
        else{
            if(!!navigator.plugins['Shockwave Flash']){
                return false
            }
        }
        if(Nui.browser.msie){
            return 'http://rj.baidu.com/soft/detail/17153.html'
        }
        else{
            return 'http://rj.baidu.com/soft/detail/15432.html'
        }
    },
    /**
     * @func 将数字转换为逗号千分位分隔
     * @param number <String> 数字
     * @return <String>
     */
    formatNumber:function(number){
        var integer = parseInt(number);
        if(!isNaN(integer) && integer && (number = number.toString())){
            var dot = number.indexOf('.');
            var decimal = '';
            if(dot > 0){
                decimal = number.substr(dot);
            }
            return integer.toLocaleString().replace(/\.\d+$/, '') + decimal
        }
        return number
    },
    /**
     * @func 将数字转换为中文大写
     * @param number <String> 数字
     * @return <String>
     */
    numberToCN:function(number){
        //汉字的数字
        var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
        //基本单位
        var cnIntRadice = new Array('', '拾', '佰', '仟');
        //对应整数部分扩展单位
        var cnIntUnits = new Array('', '万', '亿', '兆');
        //对应小数部分单位
        var cnDecUnits = new Array('角', '分', '毫', '厘');
        //整数金额时后面跟的字符
        var cnInteger = '整';
        //整型完以后的单位
        var cnIntLast = '元';
        //最大处理的数字
        var maxNum = 999999999999999.9999;
        //金额整数部分
        var integerNum;
        //金额小数部分
        var decimalNum;
        //输出的中文金额字符串
        var chineseStr = '';
        //分离金额后用的数组，预定义
        var parts;
        if (number == '') { return ''; }
        var isMinus = number < 0;
        number = Math.abs(parseFloat(number));
        if (number >= maxNum) {
            //超出最大处理数字
            return '';
        }
        if (number == 0) {
            chineseStr = cnNums[0] + cnIntLast + cnInteger;
            return chineseStr;
        }
        //转换为字符串
        number = number.toString();
        if (number.indexOf('.') == -1) {
            integerNum = number;
            decimalNum = '';
        } else {
            parts = number.split('.');
            integerNum = parts[0];
            decimalNum = parts[1].substr(0, 4);
        }
        //获取整型部分转换
        if (parseInt(integerNum, 10) > 0) {
            var zeroCount = 0;
            var IntLen = integerNum.length;
            for (var i = 0; i < IntLen; i++) {
            var n = integerNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n == '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                chineseStr += cnNums[0];
                }
                //归零
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
            }
            chineseStr += cnIntLast;
        }
        //小数部分
        if (decimalNum != '') {
            var decLen = decimalNum.length;
            for (var i = 0; i < decLen; i++) {
            var n = decimalNum.substr(i, 1);
            if (n != '0') {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
            }
        }
        if (chineseStr == '') {
            chineseStr += cnNums[0] + cnIntLast + cnInteger;
        } else if (decimalNum == '') {
            chineseStr += cnInteger;
        }
        if(isMinus){
            chineseStr = '负' + chineseStr
        }
        return chineseStr;
    }
})

/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 模版引擎
 */

__define('lib/core/template',['lib/core/util'], function(util){

    var template = function(tplid, data, opts){
        if(this.tplid = tplid){
            if(caches[tplid]){
                return render.call(this, caches[tplid], data, opts)
            }
            var ele = document.getElementById(tplid);
            if(ele && ele.nodeName==='SCRIPT' && ele.type === 'text/html'){
                return render.call(this, caches[tplid] = ele.innerHTML, data, opts)
            }
        }
        return ''
    }

    var caches = {};

    var options = {
        openTag:'<%',
        closeTag:'%>'
    }

    var methods = {
        trim:Nui.trim,
        formatDate:util.formatDate,
        formatNumber:util.formatNumber,
        setParam:util.setParam,
        toFixed:util.toFixed,
        numberToCN:util.numberToCN
    }

    var isstr = !!''.trim;

    var snippet = ';$that.out = function(){return $that.code';

    //低版本IE用push拼接字符串效率更高
    snippet = (isstr ? '""'+snippet : '[]'+snippet+'.join("")')+'}';

    var join = function(iscode){
        if(isstr){
            if(iscode){
                return function(code){
                    return '$that.code += '+code+';'
                }
            }
            return function(code, snippet){
                return code += snippet
            }
        }
        if(iscode){
            return function(code){
                return '$that.code.push('+code+');'
            }
        }
        return function(code, snippet){
            code.push(snippet);
            return code
        }
    }

    var joinCode = join(true);

    var joinSnippet = join();

    var replaceInclude = function(tpl, openTag, closeTag, opts){
        var that = this;
        var regs = openTag.replace(/([^\s])/g, '\\$1');
        var rege = closeTag.replace(/([^\s])/g, '\\$1');
        return tpl.replace(new RegExp(regs+'\\s*include\\s+[\'\"]([^\'\"]*)[\'\"]\\s*'+rege, 'g'), function(str, tid){
            if(tid){
                var tmp = that[tid];
                if(typeof tmp === 'function'){
                    tmp = tmp();
                }
                if(typeof tmp === 'string'){
                    return render.call(that, tmp, null, opts)
                }
                else{
                    return template(tid, null, opts)
                }
            }
            return ''
        })
    }

    //部分浏览器中表单对象name属性如果和模版中需要使用的变量重名，而这个变量又不存在，返回值就会变成该dom....
    var isNode = typeof HTMLElement === 'object' ? 
    function(obj){
        return obj instanceof HTMLElement;
    } : 
    function(obj){
        return obj.nodeType === 1 && typeof obj.nodeName === 'string';
    };
    var isDom = function(obj){
        if(obj && typeof obj === 'object'){
            //元素集合
            var ele = obj[0];
            if(ele){
                return isNode(ele)
            }
            //元素
            return isNode(obj)
        }
    }

    var render = function(tpl, data, opts){
        var that = this;
        if(typeof tpl === 'string'){
            opts = opts || {};
            var openTag = opts.openTag || options.openTag, closeTag = opts.closeTag || options.closeTag;
            tpl = replaceInclude.call(that, tpl, openTag, closeTag);
            if(data && typeof data === 'object'){
                if(Nui.isArray(data)){
                    data = {
                        $list:data
                    }
                }
                var code = isstr ? '' : [];
                tpl = tpl.replace(/\s+/g, ' ');
                Nui.each(tpl.split(openTag), function(val, key){
                    val = val.split(closeTag);
                    if(key >= 1){
                        code = joinSnippet(code, compile(Nui.trim(val[0]), true))
                    }
                    else{
                        val[1] = val[0];
                    }
                    code = joinSnippet(code, compile(val[1].replace(/'/g, "\\'").replace(/"/g, '\\"')))
                });

                var variables = isstr ? '' : [];

                for(var k in data){
                    variables = joinSnippet(variables, k+'=$data.'+k+',')
                }

                if(!isstr){
                    code = code.join('');
                    variables = variables.join('');
                }

                code = 'var '+ variables +'$that=this,$method=$that.methods; $that.line=4; $that.code='+ snippet +';\ntry{\n' + code + ';}\ncatch(e){\n$that.error(e, $that.line)\n};';
                
                try{
                    var Rander = new Function('$data', code);
                    Rander.prototype.methods = methods;
                    Rander.prototype.error = error(code, data, that.tplid);
                    Rander.prototype.dom = isDom;
                    tpl = new Rander(data).out();
                    Rander = null
                }
                catch(e){
                    error(code, data, that.tplid)(e)
                }
                
            }
            return tpl
        }
        return ''
    }

    var error = function(code, data, tplid){
        return function(e, line){
            var msg = '\n';
            var codes = [];
            code = 'function anonymous($data){\n'+code+'\n}';
            code = code.split('\n');
            Nui.each(code, function(v, k){
                codes.push((k+1)+ '      ' +v.replace('$that.line++;', ''))
            })
            msg += 'code\n';
            msg += codes.join('\n')+'\n\n';
            if(typeof JSON !== undefined){
                msg += 'data\n';
                msg += JSON.stringify(data)+'\n\n'
            }
            if(tplid){
                msg += 'templateid\n';
                msg += tplid+'\n\n'
            }
            if(line){
                msg += 'line\n';
                msg += line+'\n\n'
            }
            msg += 'message\n';
            msg += e.message;
            console.error(msg)
        }
    }

    var compile = function(tpl, logic){
        if(!tpl){
            return ''
        }
        var code,res;
        if(logic){
            if((res = match(tpl, 'if')) !== undefined){
                code = 'if('+exists(res)+'){'
            }
            else if((res = match(tpl, 'elseif')) !== undefined){
                code = '\n}\nelse if('+exists(res)+'){'
            }
            else if(tpl === 'else'){
                code = '\n}\nelse{'
            }
            else if(tpl === '/if'){
                code = '}'
            }
            else if((res = match(tpl, 'each ', /\s+/)) !== undefined){
                code = 'Nui.each('+ res[0] +', function('+(res[1]||'$value')+','+(res[2]||'$index')+'){'
            }
            else if(tpl === '/each'){
                code = '});'
            }
            else if((res = match(tpl, ' | ', /\s*,\s*/)) !== undefined){
                var str = res[0];
                var i = str.lastIndexOf('(');
                var _call = '(' +exists(res.slice(1).toString()) +')';
                //赋值操作必须要用括号包裹起来
                if(i !== -1){
                    var start = str.substr(0, i);
                    var end = Nui.trimLeft(str.substr(i+1));
                    code = joinCode(start+'($that.methods.' + end + _call)
                }
                else{
                    code = joinCode('$that.methods.'+ str + _call)
                }
            }
            else if(/^(var|let|const|return|delete)\s+/.test(tpl)){
                code = exists(tpl)+';'
            }
            else{
                code = joinCode(exists(tpl, true))
            }
        }
        else{
            code = joinCode('\''+tpl+'\'')
        }
        return code + '\n' + '$that.line++;'
    }

    //判断变量是否存在
    //a.b??  a[b]??  a['b']??  a[b['c']]??
    var exists = function(code, isVal){
        return code.replace(/([\.\$\w]+\s*(\[[\'\"\[\]\w\.\$\s]+\])?)\?\?/g, function(a, b){
            var rep = '(typeof '+ b + '!=="undefined"&&'+ b +'!==null&&'+ b +'!==undefined&&!$that.dom('+ b +')';
            if(isVal){
                rep += '?' + b + ':' + '""';
            }
            return rep + ')'
        })
    }

    var match = function(str, syntax, regexp){
        var replace;
        if(str.indexOf(syntax) === 0){
            replace = ''
        }
        else if(syntax === ' | ' && str.indexOf(syntax) > 0){
            replace = ','
        }
        if(replace !== undefined){
            str = Nui.trimLeft(str.replace(syntax, replace));
            return regexp ? str.split(regexp) : str
        }
    }

    template.method = function(name, callback){
        if(!methods[name]){
            methods[name] = callback
        }
    }

    template.config = function(){
        var args = arguments;
        if(Nui.type(args[0], 'Object')){
            Nui.each(args[0], function(v, k){
                options[k] = v
            })
        }
        else if(args.length > 1 && typeof args[0] === 'string'){
            options[args[0]] = args[1]
        }
    }

    template.render = render;

    return template
})

/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 组件基类
 */

__define('lib/core/component',['lib/core/template', 'lib/core/events'], function(tpl, events){
    var module = this;
    var require = this.require;
    var extend = this.extend;
    var callMethod = function(method, args, obj){
        //实参大于形参，最后一个实参表示id
        if(args.length > method.length){
            var id = args[args.length-1];
            if(id && Nui.type(id, ['String', 'Number']) && obj._options.id !== id && obj.__id !== id){
                return
            }
        }
        method.apply(obj, args)
    }
    //去除IE67按钮点击黑边
    if(Nui.bsie7){
        Nui.doc.on('focus', 'button, input[type="button"]', function(){
            this.blur()
        })
    }
    /**
     * 单和双下划线开头表示私有方法或者属性，只能在内部使用，
     * 单下划线继承后可重写或修改，双下划线为系统预置无法修改
     * 系统预置属性方法：__id, __instances, __eventList, __parent, __component_name, __setMethod
     */
    var statics = {
        //实例对象唯一标记
        __id:0,
        //实例对象容器
        __instances:{},
        /*
        * 将实例方法接口设置为静态方法，这样可以操作多个实例，
        * 默认有 init, option, reset, destroy
        * init表示初始化组件，会查询容器内包含属性为 data-组件名-options的dom元素，并调用组件
        */
        __setMethod:function(apis, components){
            var self = this;
            Nui.each(apis, function(val, methodName){
                if(self[methodName] === undefined){
                    self[methodName] = function(){
                        var self = this, args = arguments, container = args[0], name = self.__component_name;
                        if(name && name !== 'component'){
                            if(container && container instanceof jQuery){
                                if(methodName === 'init'){
                                    var mod = components[name];
                                    if(mod){
                                        container.find('[data-'+name+'-options]').each(function(){
                                            //不能重复调用
                                            if(this.nui && this.nui[name]){
                                                return
                                            }
                                            var elem = jQuery(this);
                                            var options = elem.data(name+'Options');
                                            var _mod;
                                            if(options && typeof options === 'string'){
                                                if(/^{[\s\S]*}$/.test(options)){
                                                    options = eval('('+ options +')');
                                                }
                                                else if(_mod = require(options, true)){
                                                    if(typeof _mod.exports === 'function'){
                                                        options = _mod.exports(elem)
                                                    }
                                                    else{
                                                        options = _mod.exports;
                                                    }
                                                }
                                            }
                                            if(typeof options !== 'object'){
                                                options = {};
                                            }
                                            mod(extend(options, {
                                                target:elem
                                            }))
                                        })
                                    }
                                }
                                else{
                                    container.find('[nui_component_'+ name +']').each(function(){
                                        var obj, method;
                                        if(this.nui && (obj = this.nui[name]) && typeof (method = obj[methodName]) === 'function'){
                                            callMethod(method, Array.prototype.slice.call(args, 1), obj)
                                        }
                                    })
                                }
                            }
                            else{
                                Nui.each(self.__instances, function(obj){
                                    var method = obj[methodName];
                                    if(typeof method === 'function'){
                                        callMethod(method, args, obj)
                                    }
                                })
                            }
                        }
                        else{
                            Nui.each(components, function(v, k){
                                if(k !== 'component' && typeof v[methodName] === 'function'){
                                    v[methodName].apply(v, args)
                                }
                            })
                        }
                    }
                }
            })
            return self
        },
        //对所有实例设置默认选项
        _options:{},
        //创建组件模块时会调用一次，可用于在document上绑定事件操作实例
        _init:jQuery.noop,
        _jquery:function(elem){
            if(elem instanceof jQuery){
                return elem
            }
            return jQuery(elem)
        },
        _getSize:function(selector, dir, attr){
            var size = 0;
            attr = attr || 'border';
            dir = dir || 'tb';
            if(attr === 'all'){
                return (this._getSize(selector, dir) + 
                        this._getSize(selector, dir, 'padding') +
                        this._getSize(selector, dir, 'margin'))
            }
            var group = {
                l:['Left'],
                r:['Right'],
                lr:['Left', 'Right'],
                t:['Top'],
                b:['Bottom'],
                tb:['Top', 'Bottom']
            }
            var arr = [{
                border:{
                    l:['LeftWidth'],
                    r:['RightWidth'],
                    lr:['LeftWidth', 'RightWidth'],
                    t:['TopWidth'],
                    b:['BottomWidth'],
                    tb:['TopWidth', 'BottomWidth']
                }
            }, {
                padding:group
            }, {
                margin:group
            }];
            Nui.each(arr, function(val){
                if(val[attr]){
                    Nui.each(val[attr][dir], function(v){
                        var value = parseFloat(selector.css(attr+v));
                        size += isNaN(value) ? 0 : value
                    });
                }
            });
            return size
        },
        _$fn:function(name, module){
            jQuery.fn[name] = function(){
                var args = arguments;
                return this.each(function(){
                    var object, options = args[0];
                    var execMethod = function(){
                        if(typeof options === 'string'){
                            if(options === 'options'){
                                object.option(args[1], args[2])
                            }
                            else if(options.indexOf('_') !== 0){
                                var attr = object[options];
                                if(typeof attr === 'function'){
                                    attr.apply(object, Array.prototype.slice.call(args, 1))
                                }
                            }
                        }
                    }
                    if(this.nui && (object = this.nui[name])){
                        execMethod()
                    }
                    else if(!object){
                        if(Nui.type(options, 'Object')){
                            options.target = this
                        }
                        else{
                            options = {
                                target:this
                            }
                        }
                        object = module(options);
                        execMethod()
                    }
                })
            }
        },
        _$ready:function(name, module){
            if(typeof this.init === 'function'){
                this.init(Nui.doc)
            }
        },
        config:function(){
            var args = arguments;
            var len = args.length;
            var attr = args[0];
            if(Nui.type(attr, 'Object')){
                return this._options = jQuery.extend(true, this._options, attr)
            }
            else if(Nui.type(attr, 'String')){
                if(args.length === 1){
                    return this._options[attr]
                }
                return this._options[attr] = args[1]
            }
        },
        hasInstance:function(id){
            var exist = false;
            var instances = this.__instances;
            if(id !== undefined){
                Nui.each(instances, function(v){
                    if(v.__id === id || v._options.id === id){
                        exist = v;
                        return false
                    }
                })
            }
            else{
                for(i in instances){
                    return true
                }
            }
            return exist
        }
    }

    return ({
        _static:statics,
        _options:{
            target:null,
            //组件id，element会增加class 组件名-组件id
            id:'',
            //组件皮肤，element会增加class nui-组件名-皮肤名
            skin:'',
            //element增加一个或多个类
            className:'',
            onInit:null,
            onReset:null,
            onDestroy:null
        },
        _template:{
            style:'<%each style%><%$index%>:<%$value%>;<%/each%>'
        },
        _init:function(){
            this._exec()
        },
        _exec:jQuery.noop,
        _getTarget:function(){
            var self = this;
            if(!self.target){
                var target = self._options.target;
                var _class = self.constructor;
                if(!target){
                    return null
                }
                target = _class._jquery(target);
                self.target = self._bindComponentName(target);
            }
            return self.target
        },
        _bindComponentName:function(element){
            var self = this, _class = self.constructor;
            var attr = 'nui_component_'+_class.__component_name;
            element.attr(attr, '').each(function(){
                if(!this.nui){
                    this.nui = {};
                }
                this.nui[_class.__component_name] = self
            })
            return element
        },
        _tplData:function(data){
            var opts = this._options, 
                _class = this.constructor,
                name = 'nui-' + _class.__component_name, 
                skin = Nui.trim(opts.skin),
                getName = function(_class, arrs){
                    if(_class.__parent){
                        var _pclass = _class.__parent.constructor;
                        var _name = _pclass.__component_name;
                        if(_name !== 'component'){
                            if(skin){
                                arrs.unshift('nui-'+_name+'-'+skin);
                            }
                            arrs.unshift('nui-'+_name);
                            return getName(_pclass, arrs)
                        }
                    }
                    return arrs
                }, className = getName(_class, []);

            className.push(name);
            if(skin){
                className.push(name+'-'+skin)
            }
            if(opts.id){
                className.push(_class.__component_name + '-' + opts.id)
            }
            if(!data){
                data = {}
            }
            if(opts.className){
                className.push(opts.className)
            }
            data.className = className.join(' ');
            return data
        },
        _event:function(){
            var self = this, opts = self._options;
            if(self.element && opts.events){
                opts.element = self.element;
                events.call(self, opts)
            }
            return events.call(self)
        },
        _on:function(type, dalegate, selector, callback, trigger){
            var self = this;
            if(typeof selector === 'function'){
                trigger = callback;
                callback = selector;
                selector = dalegate;
                dalegate = null;
                selector = self.constructor._jquery(selector)
            }

            var _callback = function(e){
                return callback.call(this, e, jQuery(this))
            }

            if(dalegate){
                if(typeof selector !== 'string'){
                    selector = selector.selector;
                    if(!selector){
                        selector = self._options.target
                    }
                }
                dalegate.on(type, selector, _callback);
                if(trigger){
                    dalegate.find(selector).trigger(type)
                }
            }
            else{
                selector.on(type, _callback);
                if(trigger){
                    selector.trigger(type)
                }
            }

            self.__eventList.push({
                dalegate:dalegate,
                selector:selector,
                type:type,
                callback:_callback
            });

            return self
        },
        _off:function(){
            var self = this, _eventList = self.__eventList;
            Nui.each(_eventList, function(val, key){
                if(val.dalegate){
                    val.dalegate.off(val.type, val.selector, val.callback)
                }
                else{
                    val.selector.off(val.type, val.callback)
                }
                _eventList[key] = null;
                delete _eventList[key]
            });
            self.__eventList = [];
            return self
        },
        _delete:function(){
            var self = this, _class = self.constructor;
            if(self.target){
                var attr = 'nui_component_'+_class.__component_name;
                self.target.removeAttr(attr).each(function(){
                    if(this.nui){
                        this.nui[_class.__component_name] = null;
                        delete this.nui[_class.__component_name];
                    }
                })
            }
            _class.__instances[self.__id] = null;
            delete _class.__instances[self.__id]
        },
        _reset:function(){
            this._off();
            if(this.element){
                this.element.remove();
                this.element = null;
            }
            return this
        },
        _tpl2html:function(id, data){
            var opts = {
                openTag:'<%',
                closeTag:'%>'
            }
            if(arguments.length === 1){
                return tpl.render(this._template, id, opts)
            }
            return tpl.render.call(this._template, this._template[id], data, opts)
        },
        _callback:function(method, args){
            var self = this, opts = self._options;
            var callback = opts['on'+method];
            if(typeof callback === 'function'){
                if(args){
                    Array.prototype.unshift.call(args, self);
                    return callback.apply(opts, args);
                }
                return callback.call(opts, self)
            }
        },
        option:function(opts, isOriginal){
            var args = arguments;
            var isdef = false;
            var options;
            if(args[0] === true){
                isdef = true
            }
            else if(jQuery.isPlainObject(args[0])){
                options = args[0]
                isdef = args[1]
            }
            else if(args.length > 1 && typeof args[0] === 'string'){
                options = {};
                options[args[0]] = args[1]
                isdef = args[2]
            }
            if(options||isdef){
                this._options = jQuery.extend(true, {}, this[isdef === true ? '_defaultOptions' : '_options'], options)
                this._reset();
                this._exec();
            }
            return this
        },
        reset:function(){
            this.option(true);
            this._callback('Reset');
            return this;
        },
        destroy:function(){
            this._delete();
            this._reset();
            this._callback('Destroy');
        }
    })
})

__define('lib/components/search/search',['lib/core/component', 'lib/components/search/pinyin'], function(component, pinyin){
    this.imports('../../style/components/search/index');
    return this.extend(component, {
        
    })
})
__define('./script/page',function(require,imports,renders,extend,exports){
	var module=this;
	require('lib/components/search/search');
	
	
});

})(Nui['_module_2_define']);