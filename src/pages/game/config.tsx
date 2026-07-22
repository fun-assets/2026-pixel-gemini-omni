import { createContext, Dispatch, SetStateAction } from 'react';

export enum GameStepType {
  unset,
  chooseWebcam,
  startGame,
}
export type TGameState = { step: GameStepType; webcamDeviceId?: string };
export type TGameContext = [TGameState, Dispatch<SetStateAction<TGameState>>];

export const GameState = { step: GameStepType.unset };
export const GameContext = createContext<TGameContext>([GameState, () => {}]);
