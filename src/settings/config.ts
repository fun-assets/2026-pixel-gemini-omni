import { 夏日網頁, 時尚雜誌, 禮盒3D, 空降城市, 經典Chrome小恐龍, 繽紛蠟筆 } from './prompt';

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
    simplify: '請根據上傳圖片生成一段Q版 3D 數位渲染圖驚喜禮物盒影片',
    prompt: 禮盒3D,
    video: 'videos/LOOP3D禮盒.mp4',
  },
  {
    name: '繽紛蠟筆',
    simplify: '請根據上傳圖片生成一段繽紛蠟筆風格的慶祝影片',
    prompt: 繽紛蠟筆,
    video: 'videos/LOOP繽紛蠟筆.mp4',
  },
  {
    name: '夏日網頁',
    simplify: '請根據上傳圖片生成一段在網頁上跑來跑去的可愛公仔',
    prompt: 夏日網頁,
    video: 'videos/LOOP夏日網頁.mp4',
  },
  {
    name: '空降城市',
    simplify: '請根據上傳圖片生成一段高級超現實時尚 CGI 廣告',
    prompt: 空降城市,
    video: 'videos/LOOP城市空降.mp4',
  },
  {
    name: '時尚雜誌',
    simplify: '根據上傳圖片生成一段時尚拍攝最後印出雜誌封面的影片',
    prompt: 時尚雜誌,
    video: 'videos/LOOP時尚雜誌.mp4',
  },
  {
    name: '經典Chrome小恐龍',
    simplify: '像素風冒險：主角騎乘經典瀏覽器小恐龍，躍過沙漠仙人掌，橫向卷軸跟拍。',
    prompt: 經典Chrome小恐龍,
    video: 'videos/LOOP經典小恐龍.mp4',
  },
];

export const APPS_REDIRECT = 'https://pixel-gemini.netlify.app/apps';
export const VIDEO_DOWNLOAD = 'https://pixel-gemini.netlify.app/download';
