import { createContext, Dispatch, SetStateAction } from 'react';

export enum GamePageType {
  landing = '/landing',
}

export enum GameStepType {
  unset,
}
export type TGameState = { step: GameStepType; page: GamePageType };
export type TGameContext = [TGameState, Dispatch<SetStateAction<TGameState>>];

export const GameState = { step: GameStepType.unset, page: GamePageType.landing };
export const GameContext = createContext<TGameContext>([GameState, () => {}]);
