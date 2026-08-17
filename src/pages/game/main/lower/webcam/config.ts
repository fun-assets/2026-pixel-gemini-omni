import { createContext, Dispatch, SetStateAction } from 'react';

// Extra zoom applied on top of object-fit: cover, for webcams whose stream already has
// black bars baked in (e.g. near-square sensors letterboxed to a wider aspect by the driver).
// 1 = no extra zoom. Increase per-device to crop those bars out of both preview and capture.
export const WEBCAM_ZOOM_SCALE: number = 1.4;

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
  step: GameWebcamStepsStepType.logoShowing,
};
export const GameWebcamStepsContext = createContext<TGameWebcamStepsContext>([
  GameWebcamStepsState,
  () => {},
]);
