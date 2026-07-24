import { createContext, Dispatch, SetStateAction } from 'react';

export enum GameLowerStepType {
  entry,
  webcam,
  qrcode,
}

export enum GamePagesType {
  webcamPicker,
  game,
}
export type TGameState = { page: GamePagesType; webcamDeviceId?: string; step: GameLowerStepType };
export type TGameContext = [TGameState, Dispatch<SetStateAction<TGameState>>];

export const GameState = { page: GamePagesType.game, step: GameLowerStepType.entry };
export const GameContext = createContext<TGameContext>([GameState, () => {}]);
