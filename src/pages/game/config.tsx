import { createContext, Dispatch, SetStateAction } from 'react';

export enum GameLowerStepType {
  entry,
  chooseStyle,
  webcam,
  processing,
  preview,
  guide,
  qrcode,
  error,
}

export enum GamePagesType {
  webcamPicker,
  game,
}

export type TGameState = {
  page: GamePagesType;
  webcamDeviceId?: string;
  step: GameLowerStepType;
  styleSelected: number;
  capture?: () => string | undefined;
  resultBase64?: string;
  videoURL?: string;
  cloudVideoURL?: string;
};
export type TGameContext = [TGameState, Dispatch<SetStateAction<TGameState>>];

export const GameState: TGameState = {
  page: GamePagesType.game,
  step: GameLowerStepType.chooseStyle,
  styleSelected: 0,
  resultBase64:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAr0lEQVR4nO3RQQ0AIBDAsAP/nuGNAvZoFSzZOjNnyNi/A3gZEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmD5ppYB4l7cEBoAAAAASUVORK5CYII=',
  videoURL: '12540789_1080_1920_30fps.mp4',
  cloudVideoURL: 'https://npm-demo.b-cdn.net/googlePixel/12525359_2160_3840_50fps.mp4',
};
export const GameContext = createContext<TGameContext>([GameState, () => {}]);

export const GameStyles = [
  {
    name: '經典 Chrome 小恐龍',
    prompt:
      '將人物轉成經典 Chrome 小恐龍世界觀角色，保留原本人臉五官辨識度，像素風、8-bit、灰白沙漠背景、仙人掌與低飽和色調，動作呈現奔跑中瞬間，整體乾淨俐落。',
  },
  {
    name: '可愛Q版分身',
    prompt:
      '把人物設計成可愛 Q 版分身，頭身比約 2.5:1，大眼睛、柔和腮紅、圓潤線條，糖果色系，背景加入星星與泡泡，保持人物髮型與服裝特色。',
  },
  {
    name: '超現實主義',
    prompt:
      '將人物做成超現實主義肖像：漂浮幾何物件、液態金屬反射、雲霧與錯位透視，光影強烈且帶夢境感，畫面細節精緻，保留人物神情作為視覺核心。',
  },
  {
    name: '潮流文化',
    prompt:
      '把人物轉成潮流文化視覺海報風，街頭塗鴉、霓虹色塊、拼貼字體與貼紙元素，服裝帶有球鞋與配件感，姿勢自信有態度，整體像時尚社群封面。',
  },
  {
    name: '戰鬥陀螺',
    prompt:
      '將人物設計為戰鬥陀螺主題角色，加入高速旋轉特效、能量火花、金屬零件與競技場背景，動作張力強、表情熱血，色彩高對比、漫畫感分明。',
  },
  {
    name: '時尚匹克球',
    prompt:
      '把人物轉成時尚匹克球運動形象，明亮球場、清爽陽光、運動服穿搭感，手持球拍做出揮拍瞬間，兼具運動活力與雜誌時尚感，構圖俐落。',
  },
];

export const WebcamForceOpen = false;
