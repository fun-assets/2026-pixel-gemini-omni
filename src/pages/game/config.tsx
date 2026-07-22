import { createContext, Dispatch, SetStateAction } from 'react';

export enum GamePagesType {
  entry,
  choose,
  webcam,
  qrcode,
}

export enum GameStepType {
  chooseWebcam,
  startGame,
}
export type TGameState = { step: GameStepType; webcamDeviceId?: string; page: GamePagesType };
export type TGameContext = [TGameState, Dispatch<SetStateAction<TGameState>>];

export const GameState = { step: GameStepType.chooseWebcam, page: GamePagesType.entry };
export const GameContext = createContext<TGameContext>([GameState, () => {}]);
