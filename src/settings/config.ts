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
      '人物轉為蠟筆插圖風格，長相服裝與圖片一致。畫面延續原姿態後轉場，背景為砂岩粉橄欖綠蠟筆質感；人物興奮拔開香檳塞，濃密泡沫噴發，彩色紙屑飛舞；人物開心跳躍，畫面歡慶活力。人數須與圖片相符。',
    prompt: 繽紛蠟筆,
    video: 'videos/LOOP繽紛蠟筆.mp4',
  },
  // {
  //   name: '空降城市',
  //   simplify:
  //     '將照片轉為動畫影片，主體旁加入迷你版分身公仔，表情髮型服裝相似，加入細膩互動動畫，不得改變原主體臉部特徵與服裝。背景加上白色手繪塗鴉元素。人數須與圖片相符。',
  //   prompt: 空降城市,
  //   video: 'videos/LOOP城市空降.mp4',
  // },
  // {
  //   name: '時尚雜誌',
  //   simplify:
  //     '一鏡到底，人物五官服裝與圖片一致。人物於簡約攝影棚中，伴隨閃光燈連續擺出多個自信時尚姿態；最後畫面以掃描方式印出雜誌封面，封面附上標題文字與條碼，定格收尾。場景灰白棚拍，光影強烈。配樂時尚電音，夾雜快門聲與掃描列印聲。',
  //   prompt: 時尚雜誌,
  //   video: 'videos/LOOP時尚雜誌.mp4',
  // },
  {
    name: '迷你分身',
    simplify:
      '將照片轉為動畫影片，主體旁加入迷你版分身公仔，表情髮型服裝相似，加入細膩互動動畫，不得改變原主體臉部特徵與服裝。背景加上白色手繪塗鴉元素。人數須與圖片相符。',
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
