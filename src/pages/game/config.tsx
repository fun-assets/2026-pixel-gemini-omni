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
  retakeAmount: number;
};
export type TGameContext = [TGameState, Dispatch<SetStateAction<TGameState>>];

export const GameState: TGameState = {
  page: GamePagesType.game,
  step: GameLowerStepType.webcam,
  styleSelected: 0,
  resultBase64:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAr0lEQVR4nO3RQQ0AIBDAsAP/nuGNAvZoFSzZOjNnyNi/A3gZEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmD5ppYB4l7cEBoAAAAASUVORK5CYII=',
  videoURL: '12540789_1080_1920_30fps.mp4',
  cloudVideoURL: 'https://npm-demo.b-cdn.net/googlePixel/12525359_2160_3840_50fps.mp4',
  retakeAmount: 1,
};
export const GameContext = createContext<TGameContext>([GameState, () => {}]);

export const WebcamForceOpen = false;
