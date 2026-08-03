import {
  可愛Q版分身,
  戰鬥陀螺,
  時尚匹克球,
  潮流文化,
  經典Chrome小恐龍,
  超現實主義,
} from './prompt';

export const REST_PATH = {
  // mongodb
  login: 'login',
  connect: 'connect',
  select: 'select',
  insert: 'insert',
  insertMany: 'insertMany',
  delete: 'delete',
  update: 'update',
  // cloudinary images
  upload: 'upload',
  search: 'search',
  remove: 'remove',
  removeMany: 'removeMany',
  generateVideo: 'generateVideo',
  getVideoOperation: 'getVideoOperation',
  saveImage: 'saveImage',
  uploadLocalVideo: 'uploadLocalVideo',
  // tracking
  tracking: 'tracking',
};

export const CAPTURE_PROPERTY = {
  maxWidth: 500,
  compress: 0.3,
};

export const APP_URI = {
  android: 'https://play.google.com/store/apps/details?id=com.google.android.apps.bard&hl=zh_TW',
  ios: 'https://apps.apple.com/us/app/google-gemini/id6477489729',
};

export const GameStyles = [
  {
    name: '經典 Chrome 小恐龍',
    simplify:
      '像素風冒險：上傳圖片主角騎乘經典瀏覽器小恐龍，躍過沙漠仙人掌，橫向卷軸跟拍；踩加速板衝刺，鏡頭拉遠，計分牌狂飆並綻放金色煙火；小恐龍煞車，兩人正面歡呼，彈出立體通關字樣。配樂為復古電玩風格，含跳躍、衝刺與通關音效。角色需符合上傳圖片與經典小恐龍樣貌。',
    prompt: 經典Chrome小恐龍,
  },
  {
    name: '可愛Q版分身',
    simplify:
      '將照片轉為動畫影片，主體旁加入可愛迷你版分身公仔，表情、髮型與服裝需與原主體相似。加入細膩互動動畫，但不得改變原主體臉部特徵與服裝。背景加上可愛白色手繪塗鴉元素。',
    prompt: 可愛Q版分身,
  },
  {
    name: '超現實主義',
    simplify:
      '一鏡到底，禁止跳接，僅原始人物，臉部服裝與圖片一致。高訂時尚廣告結合超現實風格，慢動作。人物自藍天白雲飄落，鏡頭環繞旋轉，周圍懸浮連帽衣、托特包、墨鏡、球鞋等時尚單品；人物變換姿態輕觸單品；鏡頭拉遠，人物微笑，雲朵凝聚成標語定格。配樂輕快電音，夾雜風聲與飾品碰撞聲。',
    prompt: 超現實主義,
  },
  {
    name: '潮流文化',
    simplify:
      '一鏡到底，禁止跳接，僅原始兩位人物，臉部服裝與圖片一致。風格為街頭塗鴉龐克，高對比復古質感。人物步入鏡頭，手持噴漆罐轉身面對鏡頭；鏡頭推近，隨噴漆軌跡浮現塗鴉手寫字樣；人物擺出自信姿態；最後瀟灑轉身走出鏡頭，留下塗鴉字樣。場景為純白攝影棚，光影對比強烈。配樂為重低音街頭節奏，夾雜噴漆聲與金屬滾珠聲。',
    prompt: 潮流文化,
  },
  {
    name: '戰鬥陀螺',
    simplify:
      '僅原始兩位人物，臉部服裝與圖片一致。風格為熱血動漫改編真人電影感，高對比張力光影。人物延續原圖姿態；鏡頭轉為側臉對峙特寫，背景轉為廢墟並出現對戰桌；兩人握緊發射器蓄勢待發；鏡頭俯衝至陀螺對撞特寫，火花四濺；鏡頭拉遠，勝方歡呼跳躍，敗方跪地掩面，定格收尾。場景為金屬對戰台，配樂為熱血交響樂，夾雜金屬碰撞與歡呼聲。',
    prompt: 戰鬥陀螺,
  },
  {
    name: '時尚匹克球',
    simplify:
      '一鏡到底，無跳接，僅原始兩位人物，臉部服裝與圖片一致。風格為陽光體育賽事廣告，畫面透亮流暢。場景轉為球場，人物發球對打，鏡頭橫移跟拍；一方躍起扣殺得分；鏡頭拉遠，勝方歡呼，雙方拍網致意，定格於陽光同框畫面。場景為清晨戶外球場，綠樹藍天。配樂輕快動感，夾雜擊球聲、煞車聲與歡呼鳥鳴。',
    prompt: 時尚匹克球,
  },
];
