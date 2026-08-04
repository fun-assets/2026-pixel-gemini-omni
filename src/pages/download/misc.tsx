const triggerDirectDownload = (videoUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = videoUrl;
  link.download = filename;
  link.target = '_self';
  link.rel = 'noopener noreferrer';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export async function downloadMobileMp4(videoUrl: string, filename = 'google-pixel-11.mp4') {
  triggerDirectDownload(videoUrl, filename);
}
