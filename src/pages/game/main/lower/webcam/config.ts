import { createContext, Dispatch, SetStateAction } from 'react';

export enum GameWebcamStepsStepType {
  logoShowing,
  shootingPosition,
  countDown,
  captureAndConfirm,
  prompt,
  fetching,
}

export type TGameWebcamStepsState = { step: GameWebcamStepsStepType };
export type TGameWebcamStepsContext = [
  TGameWebcamStepsState,
  Dispatch<SetStateAction<TGameWebcamStepsState>>,
];

export const GameWebcamStepsState = {
  step: GameWebcamStepsStepType.logoShowing,
};
export const GameWebcamStepsContext = createContext<TGameWebcamStepsContext>([
  GameWebcamStepsState,
  () => {},
]);
