import { createContext, Dispatch, SetStateAction } from 'react';

export enum GameWebcamStepsStepType {
  logoShowing,
  shootingPosition,
  countDown,
  captureAndConfirm,
  prompt,
}

export type TGameWebcamStepsState = { step: GameWebcamStepsStepType };
export type TGameWebcamStepsContext = [
  TGameWebcamStepsState,
  Dispatch<SetStateAction<TGameWebcamStepsState>>,
];

export const GameWebcamStepsState = {
  step: GameWebcamStepsStepType.prompt,
};
export const GameWebcamStepsContext = createContext<TGameWebcamStepsContext>([
  GameWebcamStepsState,
  () => {},
]);
