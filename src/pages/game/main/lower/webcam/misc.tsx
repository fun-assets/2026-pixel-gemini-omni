export const AUTO_DEVICE_ID = '__auto__';

let activeStream: MediaStream | null = null;
let activeDeviceId: string | undefined;
const attachedVideos = new Set<HTMLVideoElement>();
let cleanupRegistered = false;

export const normalizeDeviceId = (deviceId?: string) => {
  if (!deviceId || deviceId === AUTO_DEVICE_ID) return undefined;
  return deviceId;
};

const registerCleanup = () => {
  if (cleanupRegistered) return;
  cleanupRegistered = true;

  // Keep webcam alive during SPA navigation and release only when page closes.
  window.addEventListener('beforeunload', () => {
    shutdownWebcam();
  });
};

const assertCameraAvailability = () => {
  if (!window.isSecureContext) {
    throw new Error('Camera requires HTTPS or localhost secure context.');
  }

  if (!navigator.mediaDevices?.getUserMedia || !navigator.mediaDevices?.enumerateDevices) {
    throw new Error('This browser does not support camera access APIs.');
  }
};

const requestCameraPermission = async () => {
  const tempStream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'user' },
    audio: false,
  });
  tempStream.getTracks().forEach((track) => track.stop());
};

export const getVideoDevices = async () => {
  assertCameraAvailability();
  let devices = await navigator.mediaDevices.enumerateDevices();
  let videoDevices = devices.filter((device) => device.kind === 'videoinput');

  const needsPermissionBootstrap =
    videoDevices.length === 0 ||
    videoDevices.every((device) => !device.deviceId && !device.label && !device.groupId);

  if (needsPermissionBootstrap) {
    await requestCameraPermission();
    devices = await navigator.mediaDevices.enumerateDevices();
    videoDevices = devices.filter((device) => device.kind === 'videoinput');
  }

  return videoDevices;
};

export const detachWebcam = (video: HTMLVideoElement) => {
  attachedVideos.delete(video);
  video.pause();
  video.srcObject = null;
};

export const stopWebcam = detachWebcam;

export const shutdownWebcam = () => {
  if (activeStream) {
    activeStream.getTracks().forEach((track) => track.stop());
  }
  activeStream = null;
  activeDeviceId = undefined;

  attachedVideos.forEach((video) => {
    video.pause();
    video.srcObject = null;
  });
  attachedVideos.clear();
};

const bindStreamToVideo = ({
  video,
  stream,
  onError,
}: {
  video: HTMLVideoElement;
  stream: MediaStream;
  onError?: (err: any) => void;
}) => {
  attachedVideos.add(video);
  if (video.srcObject !== stream) {
    video.srcObject = stream;
  }
  video.onloadedmetadata = () => {
    video.play().catch((err) => {
      console.error('Error playing webcam stream: ', err);
      onError?.(err);
    });
  };
};

export const startWebcam = async ({
  video,
  deviceId,
  onError,
}: {
  video: HTMLVideoElement;
  deviceId?: string;
  onError?: (err: any) => void;
}) => {
  try {
    assertCameraAvailability();
    registerCleanup();
    const normalizedDeviceId = normalizeDeviceId(deviceId);

    if (
      activeStream &&
      (!normalizedDeviceId || normalizedDeviceId === activeDeviceId)
    ) {
      bindStreamToVideo({ video, stream: activeStream, onError });
      return;
    }

    const baseConstraints: MediaTrackConstraints = {
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      frameRate: { ideal: 30, max: 60 },
    };

    const constraintsCandidates: MediaStreamConstraints[] = [];
    if (normalizedDeviceId) {
      constraintsCandidates.push({
        video: { ...baseConstraints, deviceId: { exact: normalizedDeviceId } },
        audio: false,
      });
    }
    constraintsCandidates.push({
      video: { ...baseConstraints, facingMode: 'user' },
      audio: false,
    });
    constraintsCandidates.push({ video: true, audio: false });

    let stream: MediaStream | undefined;
    let lastError: unknown;
    for (const constraints of constraintsCandidates) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!stream) {
      throw lastError instanceof Error ? lastError : new Error('Failed to access camera stream.');
    }

    if (activeStream && activeStream !== stream) {
      activeStream.getTracks().forEach((track) => track.stop());
    }

    activeStream = stream;
    activeDeviceId = normalizedDeviceId;

    attachedVideos.forEach((attachedVideo) => {
      bindStreamToVideo({ video: attachedVideo, stream, onError });
    });

    bindStreamToVideo({ video, stream, onError });
  } catch (err) {
    console.error('Error accessing webcam: ', err);
    onError?.(err);
  }
};
