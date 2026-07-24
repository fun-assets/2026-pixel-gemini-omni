import { createContext, Dispatch, SetStateAction } from 'react';

export enum GameLowerStepType {
  entry,
  choose,
  webcam,
  qrcode,
}

export enum GamePagesType {
  webcamPicker,
  game,
}
export type TGameState = { page: GamePagesType; webcamDeviceId?: string; step: GameLowerStepType };
export type TGameContext = [TGameState, Dispatch<SetStateAction<TGameState>>];

export const GameState = { page: GamePagesType.webcamPicker, step: GameLowerStepType.entry };
export const GameContext = createContext<TGameContext>([GameState, () => {}]);
