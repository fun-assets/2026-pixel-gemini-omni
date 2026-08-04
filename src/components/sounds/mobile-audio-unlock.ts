/**
 * 移動設備音頻解鎖工具
 * 解決 iOS Safari 和其他移動瀏覽器的音頻限制問題
 */

// 介面擴展
interface AudioContextConstructor {
  new (): AudioContext;
}

interface WindowWithWebAudio extends Window {
  AudioContext?: AudioContextConstructor;
  webkitAudioContext?: AudioContextConstructor;
  unlockAudio?: () => Promise<void>;
  isAudioUnlocked?: () => boolean;
  getAudioContext?: () => AudioContext | null;
}

// 音頻上下文解鎖狀態
let isUnlocked: boolean = false;
let audioContext: AudioContext | null = null;

// 創建靜音音頻緩衝區用於解鎖
function createAudioBuffer(): AudioBufferSourceNode | null {
  if (!audioContext) {
    // 嘗試創建 AudioContext (標準) 或 webkitAudioContext (Safari)
    const win = window as WindowWithWebAudio;
    const AudioContextClass = win.AudioContext || win.webkitAudioContext;
    if (AudioContextClass) {
      audioContext = new AudioContextClass();
    }
  }

  if (!audioContext) return null;

  // 創建一個極短的靜音音頻緩衝區
  const buffer = audioContext.createBuffer(1, 1, 22050);
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);

  return source;
}

// 解鎖音頻的函數
function unlockAudio(): Promise<void> {
  if (isUnlocked) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const source = createAudioBuffer();

    if (source && audioContext) {
      // 嘗試播放靜音音頻來解鎖
      source.onended = (): void => {
        isUnlocked = true;
        // console.log('音頻已解鎖');
        resolve();
      };

      source.start(0);

      // 如果上下文處於暫停狀態，嘗試恢復
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          isUnlocked = true;
          resolve();
        });
      }
    } else {
      // 如果無法創建 AudioContext，仍然標記為已解鎖
      isUnlocked = true;
      resolve();
    }
  });
}

// 檢查是否需要用戶交互來解鎖音頻
function setupAudioUnlock(): void {
  // 如果已經解鎖，直接返回
  if (isUnlocked) return;

  // 監聽用戶的第一次交互
  const unlockEvents: string[] = ['touchstart', 'touchend', 'mousedown', 'keydown', 'click'];

  function unlock(): void {
    unlockAudio().then(() => {
      // 移除所有事件監聽器
      unlockEvents.forEach((event) => {
        document.removeEventListener(event, unlock, true);
      });
    });
  }

  // 為所有可能的用戶交互事件添加監聽器
  unlockEvents.forEach((event) => {
    document.addEventListener(event, unlock, true);
  });
}

// 頁面可見性變化處理
function handleVisibilityChange(): void {
  if (!document.hidden && audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

// 初始化音頻解鎖
function initMobileAudioUnlock(): void {
  setupAudioUnlock();

  // 監聽頁面可見性變化
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // 監聽頁面獲得焦點
  window.addEventListener('focus', (): void => {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  });
}

// 自動初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileAudioUnlock);
} else {
  initMobileAudioUnlock();
}

// 導出全局方法
const win = window as WindowWithWebAudio;
win.unlockAudio = unlockAudio;
win.isAudioUnlocked = (): boolean => isUnlocked;
win.getAudioContext = (): AudioContext | null => audioContext;
