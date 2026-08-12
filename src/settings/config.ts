import { 時尚雜誌, 禮盒3D, 空降城市, 繽紛蠟筆, 迷你分身 } from './prompt';

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
    name: '3D禮盒',
    simplify:
      '一鏡到底，人物轉為矽膠質感立體公仔，五官髮型與圖片一致。禮物盒登場，盒蓋彈開，公仔蹦出並旋轉展示活潑表情，周圍噴發星星彩帶；最後落定揮手擺勝利姿態定格。場景柔和夢幻，光澤細膩。配樂歡快，夾雜開盒與歡呼聲。',
    prompt: 禮盒3D,
    video: 'videos/LOOP3D禮盒.mp4',
  },
  {
    name: '繽紛蠟筆',
    simplify:
      '人物轉為蠟筆彩繪風格，長相服裝與圖片一致。畫面延續原姿態後轉場，背景為砂岩粉橄欖綠蠟筆質感；人物興奮拔開香檳塞，濃密泡沫噴發，彩色紙屑飛舞；最後人物歡呼定格，畫面歡慶活力。人數須與圖片相符。',
    prompt: 繽紛蠟筆,
    video: 'videos/LOOP繽紛蠟筆.mp4',
  },
  // {
  //   name: '空降城市',
  //   simplify:
  //     '一鏡到底，物品形狀顏色材質與圖片一致。直升機吊掛巨型化物品飛入市中心高空；鏡頭環繞降落，物品置於廣場中央，反射大樓光影；直升機解纜飛離，物品如地標矗立；鏡頭拉遠定格，畫面震撼。場景為晴朗商圈廣場，配樂震撼電音，夾雜螺旋槳轟鳴與風聲。',
  //   prompt: 空降城市,
  //   video: 'videos/LOOP城市空降.mp4',
  // },
  {
    name: '時尚雜誌',
    simplify:
      '一鏡到底，人物五官服裝與圖片一致。人物於簡約攝影棚中，伴隨閃光燈連續擺出多個自信時尚姿態；最後畫面以掃描方式印出雜誌封面，封面附上標題文字與條碼，定格收尾。場景灰白棚拍，光影強烈。配樂時尚電音，夾雜快門聲與掃描列印聲。',
    prompt: 時尚雜誌,
    video: 'videos/LOOP時尚雜誌.mp4',
  },
  {
    name: '迷你分身',
    simplify:
      '一鏡到底，人物轉為立體公仔，五官髮型與圖片一致。俯視漂浮水面上的搜尋網頁，公仔躺臥呼吸，周圍擺放沙灘排球、陽傘、衝浪板；公仔伸懶腰拋接排球，靠板揮手俏皮互動；最後起身露出笑容擺姿勢定格。場景為波光水面，夏日陽光明亮。配樂輕快，夾雜水波與鳥鳴。',
    prompt: 迷你分身,
    video: 'videos/LOOP迷你分身.mp4',
  },
  // {
  //   name: '經典Chrome小恐龍',
  //   simplify:
  //     '像素風冒險：主角騎乘經典瀏覽器小恐龍躍過沙漠仙人掌，橫向卷軸跟拍；踩加速板衝刺，計分牌狂飆並綻放金色煙火；小恐龍煞車，兩人歡呼，彈出通關字樣。配樂復古電玩風，含跳躍衝刺與通關音效。角色需符合圖片與小恐龍樣貌。',
  //   prompt: 經典Chrome小恐龍,
  //   video: 'videos/LOOP經典小恐龍.mp4',
  // },
];

export const APPS_REDIRECT = 'https://pixel-gemini.netlify.app/apps';
export const VIDEO_DOWNLOAD = 'https://pixel-gemini.netlify.app/download';
