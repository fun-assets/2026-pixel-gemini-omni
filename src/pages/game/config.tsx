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

  // video
  readyToGenerateVideo: boolean;
  generatedVideo: boolean;
  fakeSendPrompt: boolean;
};
export type TGameContext = [TGameState, Dispatch<SetStateAction<TGameState>>];

export const GameState: TGameState = {
  page: GamePagesType.webcamPicker,
  step: GameLowerStepType.entry,
  styleSelected: 2,
  resultBase64:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAr0lEQVR4nO3RQQ0AIBDAsAP/nuGNAvZoFSzZOjNnyNi/A3gZEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmBJgCUBlgRYEmD5ppYB4l7cEBoAAAAASUVORK5CYII=',
  videoURL: 'output/videos/2026-08-03/20260803202430798-9sid8gqx.mp4',
  cloudVideoURL: 'https://npm-demo.b-cdn.net/googlePixel/12525359_2160_3840_50fps.mp4',
  retakeAmount: 1,
  readyToGenerateVideo: false,
  generatedVideo: false,
  fakeSendPrompt: false,
};
export const GameContext = createContext<TGameContext>([GameState, () => {}]);

export const WebcamForceOpen = false;
