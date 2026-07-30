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
    prompt:
      '以經典 Chrome 小恐龍世界觀重製人物肖像：主角為側身奔跑姿態，保留原始臉部辨識特徵，採 8-bit 像素描邊與低彩度灰沙背景，地平線放置仙人掌與碎石，光線模擬午後逆光，畫面比例 4:3，構圖乾淨、邊緣銳利，整體質感接近真實遊戲截圖。',
  },
  {
    name: '可愛Q版分身',
    prompt:
      '建立可愛 Q 版分身角色：頭身比約 2.5:1，保留髮型與服裝主色，加入自然皮膚質感與柔焦腮紅，大眼高光與微笑表情，背景使用糖果色漸層與漂浮星星泡泡，畫面採棚拍打光邏輯，讓角色可愛但具備寫實材質層次。',
  },
  {
    name: '超現實主義',
    prompt:
      '生成超現實主義人物肖像：人物臉部維持高辨識度，周圍漂浮金屬幾何與半透明液態結構，加入錯位透視與薄霧景深，反射遵循物理光線，明暗對比強烈但細節清晰，整體呈現夢境般的真實攝影質感。',
  },
  {
    name: '潮流文化',
    prompt:
      '打造潮流文化海報風人物：保留五官神韻，服裝加入街頭層次穿搭與球鞋細節，背景疊加塗鴉噴漆、貼紙與霓虹字體元素，採雜誌封面級構圖與硬光補光，色彩高對比但膚色自然，成品像真實品牌形象視覺。',
  },
  {
    name: '戰鬥陀螺',
    prompt:
      '設計戰鬥陀螺主題角色場景：人物動作定格在出招瞬間，手部與身體有明確發力角度，加入高速旋轉殘影、金屬火花與競技場燈光反射，服裝材質呈現磨砂與亮面混搭，色調熱血強烈，畫面接近高品質動畫宣傳海報。',
  },
  {
    name: '時尚匹克球',
    prompt:
      '製作時尚匹克球人物形象：在戶外球場陽光下拍攝感構圖，人物穿著俐落運動時裝，保留原始臉型與髮型，手持球拍做揮拍前 0.2 秒動作，背景有淺景深觀眾席與球網細節，色彩明亮乾淨，整體像運動品牌平面廣告。',
  },
];
