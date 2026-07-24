export const getVideoDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === 'videoinput');
};

export const stopWebcam = (video: HTMLVideoElement) => {
  const stream = video.srcObject;
  if (stream instanceof MediaStream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  video.srcObject = null;
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
    stopWebcam(video);
    const videoConstraints: MediaTrackConstraints = {
      width: { ideal: 3840 },
      height: { ideal: 2160 },
      frameRate: { ideal: 30, max: 60 },
      ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
    };

    const stream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints,
    });
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play().catch((err) => {
        console.error('Error playing webcam stream: ', err);
        onError?.(err);
      });
    };
  } catch (err) {
    console.error('Error accessing webcam: ', err);
    onError?.(err);
  }
};
