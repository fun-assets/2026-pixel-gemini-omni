import { Howl } from 'howler';
// 添加 Howler 全局音頻解鎖
import './mobile-audio-unlock';
import bgm from './mp3/bgm.mp3';
import camera from './mp3/camera.mp3';
import button from './mp3/button.mp3';
import { SoundName } from './type';

type SoundTrackProps = {
  onload?: (type: PreloadType) => void;
  onError?: (message: string) => void;
};

type PreloadType = 'onStart';

export default class Sounds {
  public track: Record<
    string,
    {
      src: string[];
      loop: boolean;
      onload: boolean;
      track: Howl | null;
      preloadType: PreloadType;
    }
  > = {
    bgm: { src: [bgm], loop: true, onload: false, track: null, preloadType: 'onStart' },
    camera: { src: [camera], loop: true, onload: false, track: null, preloadType: 'onStart' },
    button: { src: [button], loop: true, onload: false, track: null, preloadType: 'onStart' },
  };

  private onload: (type: PreloadType) => void;
  private onError: (message: string) => void;

  constructor(props: SoundTrackProps) {
    this.onload = props.onload || (() => {});
    this.onError = props.onError || (() => {});

    this.preload('onStart');
    this.initMobileSupport();
  }

  private initMobileSupport(): void {
    // 等待用戶交互以解鎖音頻
    const events = ['touchstart', 'click', 'tap', 'keydown'];
    const unlock = () => {
      this.unlockAllTracks();
      events.forEach((event) => {
        document.removeEventListener(event, unlock, { capture: true });
      });
    };

    events.forEach((event) => {
      document.addEventListener(event, unlock, { capture: true, once: true });
    });

    // 處理頁面可見性變化
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(() => this.restoreAudio(), 300);
      }
    });
  }

  private unlockAllTracks(): void {
    // 為每個已載入的音軌播放極短的靜音來解鎖
    Object.values(this.track).forEach((trackInfo) => {
      if (trackInfo.track && trackInfo.onload) {
        try {
          const currentVolume = trackInfo.track.volume();
          trackInfo.track.volume(0);
          trackInfo.track.play();
          setTimeout(() => {
            trackInfo.track?.stop();
            trackInfo.track?.volume(currentVolume);
          }, 1);
        } catch {
          this.onError('音頻解鎖失敗');
        }
      }
    });
  }

  private restoreAudio(): void {
    // 重新初始化可能失效的音軌
    Object.entries(this.track).forEach(([name, trackInfo]) => {
      if (trackInfo.track && trackInfo.onload) {
        // 檢查音軌是否還能正常工作
        const testVolume = trackInfo.track.volume();
        try {
          trackInfo.track.volume(testVolume);
        } catch {
          // 如果出錯，重新創建音軌
          // console.log(`重新創建音軌: ${name}`);
          this.recreateTrack(name);
        }
      }
    });
  }

  private recreateTrack(name: string): void {
    const trackInfo = this.track[name];
    if (!trackInfo) return;

    // 停止並清理舊的音軌
    if (trackInfo.track) {
      try {
        trackInfo.track.stop();
        trackInfo.track.unload();
      } catch {
        this.onError(`清理音軌 ${name} 失敗`);
      }
    }

    // 創建新的音軌
    trackInfo.track = new Howl({
      src: trackInfo.src,
      loop: trackInfo.loop,
      // html5: false, // 在移動設備上，Web Audio API 通常更穩定
      preload: true,
      onload: () => {
        trackInfo.onload = true;
        // console.log(`音軌 ${name} 重新載入完成`);
      },
      onloaderror: () => {
        this.onError(`音軌 ${name} 重新載入失敗`);
      },
    });
  }

  preload(type: PreloadType, onload?: (type: PreloadType) => void) {
    this.onload = onload || this.onload;

    const isLoadedBefore = Object.values(this.track)
      .filter((value) => value.preloadType === type)
      .every((value) => value.onload);

    if (isLoadedBefore) {
      this.checkIsLoaded(type);
      return;
    }

    Object.entries(this.track)
      .filter((track) => track[1].preloadType === type)
      .forEach(([key, value]) => {
        this.track[key].track = new Howl({
          src: value.src,
          loop: value.loop,
          onload: () => {
            value.onload = true;
            this.checkIsLoaded(type);
          },
        });
      });
  }

  checkIsLoaded(type: PreloadType) {
    if (type === 'onStart') {
      const isOnStartLoaded = Object.values(this.track)
        .filter((value) => value.preloadType === 'onStart')
        .every((value) => value.onload);
      if (isOnStartLoaded) {
        this.onload('onStart');
      }
    }
  }

  preloadByName(name: string[], preload: PreloadType, onload?: (type: PreloadType) => void) {
    this.onload = onload || this.onload;
    name.forEach((n) => {
      if (this.track[n] && !this.track[n].onload) {
        this.track[n].track = new Howl({
          src: this.track[n].src,
          loop: this.track[n].loop,
          html5: true,
          onload: () => {
            this.track[n].onload = true;
            if (onload) onload(preload);
          },
          onloaderror: () => {
            this.onError(`音軌 ${n} 重新載入失敗`);
          },
        });
      }
    });
  }

  play(name: SoundName, volume = 1, canPlayTwice = true) {
    const trackInfo = this.track[name];

    if (!trackInfo || !trackInfo.track) {
      this.onError(`音頻 ${name} 尚未載入或不存在`);
      return;
    }

    const track = trackInfo.track;

    const tryPlay = () => {
      if (!trackInfo.onload || !trackInfo.track) {
        setTimeout(tryPlay, 100);
        return;
      }

      if (!canPlayTwice && track.playing()) {
        this.onError(`該語音已在播放中，無法重複播放`);
        return;
      }

      try {
        // 設定音量並播放
        track.volume(volume);
        track.play();
      } catch {
        this.onError(`播放 ${name} 失敗，嘗試重新創建`);
        // 如果播放失敗，嘗試重新創建音軌
        this.recreateTrack(name);

        // 重新嘗試播放
        setTimeout(() => {
          if (this.track[name].track) {
            try {
              this.track[name].track!.volume(volume);
              this.track[name].track!.play();
            } catch (retryError) {
              this.onError(`重試播放 ${name} 也失敗: ${retryError}`);
            }
          }
        }, 100);
      }
    };

    tryPlay();
  }

  stop(name: SoundName) {
    if (this.track[name] && this.track[name].onload && this.track[name].track) {
      this.track[name].track!.stop();
    }
  }

  // 檢查音頻狀態的方法
  public checkAudioStatus(): { available: boolean; context: string } {
    const sampleTrack = Object.values(this.track).find((track) => track.track);
    if (!sampleTrack || !sampleTrack.track) {
      return { available: false, context: 'no_tracks' };
    }

    const ctx = (sampleTrack.track as any)._context;
    return {
      available: !document.hidden && ctx?.state !== 'suspended',
      context: ctx?.state || 'unknown',
    };
  }
}
