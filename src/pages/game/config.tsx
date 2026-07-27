import { createContext, Dispatch, SetStateAction } from 'react';

export enum GameLowerStepType {
  entry,
  chooseStyle,
  webcam,
  processing,
  guide,
  qrcode,
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
};
export type TGameContext = [TGameState, Dispatch<SetStateAction<TGameState>>];

export const GameState = {
  page: GamePagesType.game,
  step: GameLowerStepType.webcam,
  styleSelected: 0,
};
export const GameContext = createContext<TGameContext>([GameState, () => {}]);

export const GameStyles = [
  {
    name: '龐克音樂風',
    prompt: '',
  },
  {
    name: '時尚雜誌風',
    prompt: '',
  },
  {
    name: 'Lo-Fi插畫風',
    prompt: '',
  },
  {
    name: '3D破格風',
    prompt: '',
  },
  {
    name: '黑白搖滾風',
    prompt: '',
  },
  {
    name: '美式漫畫風',
    prompt: '',
  },
];

export const WebcamForceOpen = false;
