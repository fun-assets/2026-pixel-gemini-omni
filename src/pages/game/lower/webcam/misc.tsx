export const startWebcam = ({
  video,
  onError,
}: {
  video: HTMLVideoElement;
  onError?: (err: any) => void;
}) => {
  // start webcam
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      if (!video) return;
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play().catch((err) => {
          console.error('Error playing webcam stream: ', err);
          onError?.(err);
        });
      };
    })
    .catch((err) => {
      console.error('Error accessing webcam: ', err);
      onError?.(err);
    });
};
