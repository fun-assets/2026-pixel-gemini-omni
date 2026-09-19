import { createContext, Dispatch, SetStateAction } from 'react';

// Rotate the preview and the captured image -90deg (CCW), for landscape webcams feeding
// a portrait layout. false = show the stream in its native orientation.
export const WEBCAM_ROTATE_90: boolean = false;

// Extra zoom applied on top of object-fit: cover, for webcams whose stream already has
// black bars baked in (e.g. near-square sensors letterboxed to a wider aspect by the driver).
// 1 = no extra zoom. Increase per-device to crop those bars out of both preview and capture.
export const WEBCAM_ZOOM_SCALE: number = WEBCAM_ROTATE_90 ? 1.4 : 1;

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
